import { listUsers, updateUserRole } from "../services/userService.js";

export async function getUsers(_req, res, next) {
  try {
    const users = await listUsers();
    return res.json({ users });
  } catch (error) {
    next(error);
  }
}

export async function changeUserRole(req, res, next) {
  try {
    const { role } = req.body;

    if (!["student", "teacher", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    const user = await updateUserRole(req.params.id, role);
    return res.json({
      message: "User role updated successfully",
      user
    });
  } catch (error) {
    next(error);
  }
}
