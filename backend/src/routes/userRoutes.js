import express from "express";
import { changeUserRole, getUsers } from "../controllers/userController.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, requireRole(["admin"]), getUsers);
router.patch("/:id/role", requireAuth, requireRole(["admin"]), changeUserRole);

export default router;
