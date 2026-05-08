import { findUserById, listUsers, updateUserRole, removeUser as deleteUser } from "../services/userService.js";
import { publicUser, signToken } from "../utils/authTokens.js";

export async function getUsers(_req, res, next) {
  try {
    const users = await listUsers();
    return res.json({ users });
  } catch (error) {
    next(error);
  }
}

export async function getUserById(req, res, next) {
  try {
    const user = await findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ user: publicUser(user) });
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

export async function accessUserAccount(req, res, next) {
  try {
    const targetUser = await findUserById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = signToken(targetUser, {
      impersonatedBy: req.user.id,
      impersonatedByRole: req.user.role
    });

    return res.json({
      message: `Access granted for ${targetUser.name}`,
      token,
      user: publicUser(targetUser),
      admin: publicUser(req.user)
    });
  } catch (error) {
    next(error);
  }
}

export async function removeUser(req, res, next) {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: "You cannot remove your own account" });
    }

    await deleteUser(req.params.id);
    return res.json({ message: "User removed successfully" });
  } catch (error) {
    next(error);
  }
}
