import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import authRoutes from "./routes/authRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const uploadsPath = path.resolve("uploads");

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
  })
);
app.use(express.json());
app.use("/uploads", express.static(uploadsPath));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", mode: process.env.SUPABASE_URL ? "supabase" : "demo" });
});

app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/users", userRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.message || "Internal server error"
  });
});

export default app;

