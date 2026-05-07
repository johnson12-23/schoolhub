import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { supabase, supabaseEnabled } from "../config/supabase.js";
import { demoResources } from "../data/demoData.js";

const bucketName = process.env.SUPABASE_BUCKET || "schoolhub-resources";
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 9;

function normalizeResource(resource) {
  return {
    id: resource.id,
    title: resource.title,
    description: resource.description,
    subject: resource.subject,
    classLevel: resource.class_level || resource.classLevel,
    type: resource.type,
    fileUrl: resource.file_url || resource.fileUrl,
    fileName: resource.file_name || resource.fileName,
    uploadedBy: resource.uploaded_by || resource.uploadedBy,
    featured: Boolean(resource.featured),
    createdAt: resource.created_at || resource.createdAt
  };
}

export async function listResources(filters = {}) {
  const page = Number(filters.page) > 0 ? Number(filters.page) : DEFAULT_PAGE;
  const pageSize = Number(filters.pageSize) > 0 ? Number(filters.pageSize) : DEFAULT_PAGE_SIZE;

  if (supabaseEnabled) {
    let query = supabase
      .from("resources")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (filters.subject) query = query.eq("subject", filters.subject);
    if (filters.classLevel) query = query.eq("class_level", filters.classLevel);
    if (filters.type) query = query.eq("type", filters.type);
    if (filters.featured) query = query.eq("featured", true);
    if (filters.uploadedBy) query = query.eq("uploaded_by", filters.uploadedBy);
    if (filters.search) {
      const keyword = sanitizeSearch(filters.search);
      query = query.or(
        `title.ilike.%${keyword}%,description.ilike.%${keyword}%,subject.ilike.%${keyword}%,type.ilike.%${keyword}%,class_level.ilike.%${keyword}%`
      );
    }

    query = query.range((page - 1) * pageSize, page * pageSize - 1);

    const { data, error, count } = await query;
    if (error) throw new Error(error.message);

    return buildPaginatedResult(data.map(normalizeResource), count ?? 0, page, pageSize);
  }

  let resources = [...demoResources];

  if (filters.subject) resources = resources.filter((item) => item.subject === filters.subject);
  if (filters.classLevel) resources = resources.filter((item) => item.classLevel === filters.classLevel);
  if (filters.type) resources = resources.filter((item) => item.type === filters.type);
  if (filters.featured) resources = resources.filter((item) => item.featured);
  if (filters.uploadedBy) resources = resources.filter((item) => item.uploadedBy === filters.uploadedBy);
  resources = applySearch(resources, filters.search);

  const total = resources.length;
  const paginated = resources.slice((page - 1) * pageSize, page * pageSize);
  return buildPaginatedResult(paginated, total, page, pageSize);
}

export async function listManagedResources(user, filters = {}) {
  if (user.role === "admin") {
    return listResources(filters);
  }

  return listResources({ ...filters, uploadedBy: user.id });
}

export async function createResource({ data, file, user, req }) {
  let fileUrl = file ? `${req.protocol}://${req.get("host")}/uploads/${file.filename}` : data.fileUrl;
  let fileName = file ? file.originalname : data.fileName;

  if (supabaseEnabled && file) {
    const buffer = await fs.readFile(file.path);
    const objectPath = `resources/${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(objectPath, buffer, {
        contentType: "application/pdf",
        upsert: true
      });

    if (uploadError) throw new Error(uploadError.message);

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(objectPath);

    fileUrl = publicUrlData.publicUrl;
    fileName = file.originalname;
  }

  const record = {
    id: uuidv4(),
    title: data.title,
    description: data.description,
    subject: data.subject,
    class_level: data.classLevel,
    type: data.type,
    file_url: fileUrl,
    file_name: fileName,
    uploaded_by: user.id,
    featured: false,
    created_at: new Date().toISOString()
  };

  if (supabaseEnabled) {
    const { data: inserted, error } = await supabase.from("resources").insert(record).select("*").single();
    if (error) throw new Error(error.message);
    return normalizeResource(inserted);
  }

  const fallbackRecord = normalizeResource(record);
  demoResources.unshift(fallbackRecord);
  return fallbackRecord;
}

export async function deleteResource(resourceId, user) {
  const resource = await getResourceById(resourceId);

  if (!resource) {
    const error = new Error("Resource not found");
    error.status = 404;
    throw error;
  }

  if (user.role !== "admin" && resource.uploadedBy !== user.id) {
    const error = new Error("You do not have permission to delete this resource");
    error.status = 403;
    throw error;
  }

  if (supabaseEnabled) {
    const objectPath = getStorageObjectPath(resource.fileUrl);
    if (objectPath) {
      const { error: storageError } = await supabase.storage.from(bucketName).remove([objectPath]);
      if (storageError) {
        throw new Error(storageError.message);
      }
    }

    const { error } = await supabase.from("resources").delete().eq("id", resourceId);
    if (error) throw new Error(error.message);
    return resource;
  }

  const index = demoResources.findIndex((item) => item.id === resourceId);
  if (index >= 0) {
    demoResources.splice(index, 1);
  }

  return resource;
}

export async function updateResource(resourceId, updates, user) {
  const resource = await getResourceById(resourceId);

  if (!resource) {
    const error = new Error("Resource not found");
    error.status = 404;
    throw error;
  }

  if (user.role !== "admin" && resource.uploadedBy !== user.id) {
    const error = new Error("You do not have permission to edit this resource");
    error.status = 403;
    throw error;
  }

  const nextValues = {
    title: updates.title,
    description: updates.description,
    subject: updates.subject,
    class_level: updates.classLevel,
    type: updates.type
  };

  if (supabaseEnabled) {
    const { data, error } = await supabase
      .from("resources")
      .update(nextValues)
      .eq("id", resourceId)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return normalizeResource(data);
  }

  const entry = demoResources.find((item) => item.id === resourceId);
  entry.title = updates.title;
  entry.description = updates.description;
  entry.subject = updates.subject;
  entry.classLevel = updates.classLevel;
  entry.type = updates.type;
  return normalizeResource(entry);
}

async function getResourceById(resourceId) {
  if (supabaseEnabled) {
    const { data, error } = await supabase.from("resources").select("*").eq("id", resourceId).maybeSingle();
    if (error) throw new Error(error.message);
    return data ? normalizeResource(data) : null;
  }

  return demoResources.find((item) => item.id === resourceId) || null;
}

function getStorageObjectPath(fileUrl) {
  if (!fileUrl?.includes(`/storage/v1/object/public/${bucketName}/`)) {
    return null;
  }

  return fileUrl.split(`/storage/v1/object/public/${bucketName}/`)[1] || null;
}

function applySearch(resources, search) {
  if (!search) return resources.map((resource) => normalizeResource(resource));

  const keyword = search.toLowerCase();
  return resources
    .map((resource) => normalizeResource(resource))
    .filter(
      (resource) =>
        resource.title.toLowerCase().includes(keyword) ||
        resource.description.toLowerCase().includes(keyword) ||
        resource.subject.toLowerCase().includes(keyword) ||
        resource.type.toLowerCase().includes(keyword) ||
        resource.classLevel.toLowerCase().includes(keyword)
    );
}

function buildPaginatedResult(resources, total, page, pageSize) {
  return {
    resources,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize))
    }
  };
}

function sanitizeSearch(value) {
  return value.trim().replace(/[%_,]/g, " ");
}
