import express from "express";
import {
  editResource,
  getManagedResources,
  getResources,
  removeResource,
  uploadResource
} from "../controllers/resourceController.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getResources);
router.get("/manage", requireAuth, requireRole(["teacher", "admin"]), getManagedResources);
router.post(
  "/",
  requireAuth,
  requireRole(["teacher", "admin"]),
  upload.single("resource"),
  uploadResource
);
router.put("/:id", requireAuth, requireRole(["teacher", "admin"]), editResource);
router.delete("/:id", requireAuth, requireRole(["teacher", "admin"]), removeResource);

export default router;
