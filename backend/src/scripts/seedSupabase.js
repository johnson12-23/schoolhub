import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = process.env.SUPABASE_BUCKET || "schoolhub-resources";

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend/.env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const pdfTemplate = (title) =>
  `%PDF-1.1
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 300 300]>>endobj
4 0 obj<</Length 57>>stream
BT /F1 18 Tf 30 150 Td (${title.slice(0, 40)}) Tj ET
endstream endobj
xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000112 00000 n 
0000000183 00000 n 
trailer<</Size 5/Root 1 0 R>>
startxref
291
%%EOF`;

const users = [
  { name: "Akosua Mensah", email: "student@schoolhub.gh", role: "student" },
  { name: "Kwame Boateng", email: "teacher@schoolhub.gh", role: "teacher" },
  { name: "Efua Addo", email: "admin@schoolhub.gh", role: "admin" }
];

const resources = [
  {
    title: "JHS 3 Mathematics Revision Pack",
    description: "Short practice notes and worked examples for algebra, fractions, and geometry.",
    subject: "Mathematics",
    classLevel: "JHS 3",
    type: "Past Questions",
    ownerEmail: "teacher@schoolhub.gh",
    featured: true
  },
  {
    title: "Primary 5 English Reading Slides",
    description: "Lightweight slide material to support comprehension and vocabulary practice.",
    subject: "English",
    classLevel: "Primary 5",
    type: "Slides",
    ownerEmail: "teacher@schoolhub.gh",
    featured: true
  },
  {
    title: "BECE Integrated Science Questions",
    description: "Past questions for revision on systems, energy, and living things.",
    subject: "Science",
    classLevel: "JHS 3",
    type: "Past Questions",
    ownerEmail: "admin@schoolhub.gh",
    featured: true
  },
  {
    title: "Primary 4 Social Studies Textbook",
    description: "A concise social studies text for community, citizenship, and culture.",
    subject: "Social Studies",
    classLevel: "Primary 4",
    type: "Textbook",
    ownerEmail: "admin@schoolhub.gh",
    featured: false
  },
  {
    title: "ICT Basics for JHS 1",
    description: "Introductory notes on computer parts, typing, and digital safety.",
    subject: "ICT",
    classLevel: "JHS 1",
    type: "Textbook",
    ownerEmail: "teacher@schoolhub.gh",
    featured: false
  }
];

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function upsertUsers() {
  const passwordHash = await bcrypt.hash("password123", 10);

  for (const user of users) {
    const { error } = await supabase.from("users").upsert(
      {
        name: user.name,
        email: user.email,
        role: user.role,
        password_hash: passwordHash
      },
      { onConflict: "email" }
    );

    if (error) {
      throw new Error(`Failed to upsert user ${user.email}: ${error.message}`);
    }
  }

  const { data, error } = await supabase.from("users").select("id, email");
  if (error) {
    throw new Error(`Failed to load seeded users: ${error.message}`);
  }

  return new Map(data.map((user) => [user.email, user.id]));
}

async function upsertResources(userIds) {
  for (const resource of resources) {
    const filePath = `resources/demo/${slugify(resource.title)}.pdf`;
    const content = Buffer.from(pdfTemplate(resource.title), "utf-8");
    const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, content, {
      contentType: "application/pdf",
      upsert: true
    });

    if (uploadError) {
      throw new Error(`Failed to upload ${resource.title}: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    const ownerId = userIds.get(resource.ownerEmail);

    const { data: existing, error: existingError } = await supabase
      .from("resources")
      .select("id")
      .eq("title", resource.title)
      .maybeSingle();

    if (existingError) {
      throw new Error(`Failed to check resource ${resource.title}: ${existingError.message}`);
    }

    const record = {
      title: resource.title,
      description: resource.description,
      subject: resource.subject,
      class_level: resource.classLevel,
      type: resource.type,
      file_url: publicUrlData.publicUrl,
      file_name: `${slugify(resource.title)}.pdf`,
      uploaded_by: ownerId,
      featured: resource.featured
    };

    if (existing?.id) {
      const { error } = await supabase.from("resources").update(record).eq("id", existing.id);
      if (error) {
        throw new Error(`Failed to update resource ${resource.title}: ${error.message}`);
      }
    } else {
      const { error } = await supabase.from("resources").insert(record);
      if (error) {
        throw new Error(`Failed to insert resource ${resource.title}: ${error.message}`);
      }
    }
  }
}

async function main() {
  const userIds = await upsertUsers();
  await upsertResources(userIds);
  console.log("Supabase seed complete.");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
