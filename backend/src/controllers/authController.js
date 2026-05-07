import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail, updateUserPassword } from "../services/userService.js";
import { generateResetToken, storeResetToken, verifyResetToken, consumeResetToken, sendPasswordResetEmail } from "../utils/emailService.js";

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

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await findUserByEmail(email);

    // Always return success to prevent email enumeration
    if (!user) {
      return res.status(200).json({ message: "If an account exists with that email, a reset link has been sent" });
    }

    const resetToken = generateResetToken();
    storeResetToken(email, resetToken);
    await sendPasswordResetEmail(email, resetToken);

    return res.status(200).json({ message: "If an account exists with that email, a reset link has been sent" });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const email = verifyResetToken(token);
    if (!email) {
      return res.status(401).json({ message: "Reset token is invalid or expired" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await updateUserPassword(user.id, passwordHash);
    consumeResetToken(token);

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
}

