import jwt from "jsonwebtoken";
import { findUserById } from "../services/userService.js";

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "change_this_secret");
    const user = await findUserById(decoded.sub);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireRole(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission to access this resource" });
    }

    next();
  };
}

