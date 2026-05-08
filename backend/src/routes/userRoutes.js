import express from "express";
import { accessUserAccount, changeUserRole, getUserById, getUsers, removeUser } from "../controllers/userController.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, requireRole(["admin"]), getUsers);
router.get("/:id", requireAuth, requireRole(["admin"]), getUserById);
router.post("/:id/access", requireAuth, requireRole(["admin"]), accessUserAccount);
router.patch("/:id/role", requireAuth, requireRole(["admin"]), changeUserRole);
router.delete("/:id", requireAuth, requireRole(["admin"]), removeUser);

export default router;
