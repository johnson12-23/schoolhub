import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const passwordHash = bcrypt.hashSync("password123", 10);

export const demoUsers = [
  {
    id: uuidv4(),
    name: "Akosua Mensah",
    email: "student@schoolhub.gh",
    passwordHash,
    role: "student",
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: "Kwame Boateng",
    email: "teacher@schoolhub.gh",
    passwordHash,
    role: "teacher",
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: "Efua Addo",
    email: "admin@schoolhub.gh",
    passwordHash,
    role: "admin",
    createdAt: new Date().toISOString()
  }
];

export const demoResources = [
  {
    id: uuidv4(),
    title: "JHS 3 Mathematics Revision Pack",
    description: "Short practice notes and worked examples for algebra, fractions, and geometry.",
    subject: "Mathematics",
    classLevel: "JHS 3",
    type: "Past Questions",
    fileUrl: "https://example.com/jhs3-maths-revision.pdf",
    fileName: "jhs3-maths-revision.pdf",
    uploadedBy: demoUsers[1].id,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: "Primary 5 English Reading Slides",
    description: "Lightweight slide material to support comprehension and vocabulary practice.",
    subject: "English",
    classLevel: "Primary 5",
    type: "Slides",
    fileUrl: "https://example.com/primary5-english-slides.pdf",
    fileName: "primary5-english-slides.pdf",
    uploadedBy: demoUsers[1].id,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: "BECE Integrated Science Questions",
    description: "Past questions for revision on systems, energy, and living things.",
    subject: "Science",
    classLevel: "JHS 3",
    type: "Past Questions",
    fileUrl: "https://example.com/bece-science-questions.pdf",
    fileName: "bece-science-questions.pdf",
    uploadedBy: demoUsers[2].id,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: "Primary 4 Social Studies Textbook",
    description: "A concise social studies text for community, citizenship, and culture.",
    subject: "Social Studies",
    classLevel: "Primary 4",
    type: "Textbook",
    fileUrl: "https://example.com/primary4-social-studies.pdf",
    fileName: "primary4-social-studies.pdf",
    uploadedBy: demoUsers[2].id,
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: "ICT Basics for JHS 1",
    description: "Introductory notes on computer parts, typing, and digital safety.",
    subject: "ICT",
    classLevel: "JHS 1",
    type: "Textbook",
    fileUrl: "https://example.com/ict-basics-jhs1.pdf",
    fileName: "ict-basics-jhs1.pdf",
    uploadedBy: demoUsers[1].id,
    featured: false,
    createdAt: new Date().toISOString()
  }
];

