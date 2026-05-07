import {
  createResource,
  deleteResource,
  listManagedResources,
  listResources,
  updateResource
} from "../services/resourceService.js";

export async function getResources(req, res, next) {
  try {
    const result = await listResources({
      subject: req.query.subject,
      classLevel: req.query.classLevel,
      type: req.query.type,
      search: req.query.search,
      featured: req.query.featured === "true",
      page: req.query.page,
      pageSize: req.query.pageSize
    });

    return res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function uploadResource(req, res, next) {
  try {
    const resource = await createResource({
      data: req.body,
      file: req.file,
      user: req.user,
      req
    });

    return res.status(201).json({
      message: "Resource uploaded successfully",
      resource
    });
  } catch (error) {
    next(error);
  }
}

export async function getManagedResources(req, res, next) {
  try {
    const result = await listManagedResources(req.user, {
      search: req.query.search,
      page: req.query.page,
      pageSize: req.query.pageSize
    });
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function removeResource(req, res, next) {
  try {
    const resource = await deleteResource(req.params.id, req.user);
    return res.json({
      message: "Resource deleted successfully",
      resource
    });
  } catch (error) {
    next(error);
  }
}

export async function editResource(req, res, next) {
  try {
    const { title, description, subject, classLevel, type } = req.body;

    if (!title || !description || !subject || !classLevel || !type) {
      return res.status(400).json({ message: "All resource fields are required" });
    }

    const resource = await updateResource(
      req.params.id,
      { title, description, subject, classLevel, type },
      req.user
    );

    return res.json({
      message: "Resource updated successfully",
      resource
    });
  } catch (error) {
    next(error);
  }
}
