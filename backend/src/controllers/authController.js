import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../services/userService.js";

function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET || "change_this_secret", {
    expiresIn: "7d"
  });
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const user = await createUser({ name, email, password, role });
    const token = signToken(user);

    return res.status(201).json({
      token,
      user: publicUser(user)
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({
      token: signToken(user),
      user: publicUser(user)
    });
  } catch (error) {
    next(error);
  }
}

export async function getCurrentUser(req, res) {
  return res.json({
    user: publicUser(req.user)
  });
}

