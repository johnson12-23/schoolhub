import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { supabase, supabaseEnabled } from "../config/supabase.js";
import { demoUsers } from "../data/demoData.js";

export async function listUsers() {
  if (supabaseEnabled) {
    const { data, error } = await supabase.from("users").select("id, name, email, role, created_at");
    if (error) throw new Error(error.message);
    return data.map(normalizeUser);
  }

  return demoUsers.map(stripPassword);
}

export async function findUserByEmail(email) {
  if (supabaseEnabled) {
    const { data, error } = await supabase.from("users").select("*").eq("email", email).single();
    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return data ? normalizeUser(data, true) : null;
  }

  return demoUsers.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function findUserById(id) {
  if (supabaseEnabled) {
    const { data, error } = await supabase.from("users").select("*").eq("id", id).single();
    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return data ? normalizeUser(data, true) : null;
  }

  return demoUsers.find((user) => user.id === id) || null;
}

export async function createUser({ name, email, password, role }) {
  const passwordHash = await bcrypt.hash(password, 10);

  if (supabaseEnabled) {
    const record = {
      id: uuidv4(),
      name,
      email,
      password_hash: passwordHash,
      role,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from("users").insert(record).select("*").single();
    if (error) throw new Error(error.message);
    return normalizeUser(data, true);
  }

  const user = {
    id: uuidv4(),
    name,
    email,
    passwordHash,
    role,
    createdAt: new Date().toISOString()
  };

  demoUsers.push(user);
  return user;
}

export async function updateUserRole(userId, role) {
  if (supabaseEnabled) {
    const { data, error } = await supabase
      .from("users")
      .update({ role })
      .eq("id", userId)
      .select("id, name, email, role, created_at")
      .single();

    if (error) throw new Error(error.message);
    return normalizeUser(data);
  }

  const user = demoUsers.find((entry) => entry.id === userId);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  user.role = role;
  return stripPassword(user);
}

export async function updateUserPassword(userId, passwordHash) {
  if (supabaseEnabled) {
    const { error } = await supabase
      .from("users")
      .update({ password_hash: passwordHash })
      .eq("id", userId);

    if (error) throw new Error(error.message);
    return true;
  }

  const user = demoUsers.find((entry) => entry.id === userId);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  user.passwordHash = passwordHash;
  return true;
}

function normalizeUser(user, includePassword = false) {
  const normalized = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.created_at || user.createdAt
  };

  if (includePassword) {
    normalized.passwordHash = user.password_hash || user.passwordHash;
  }

  return normalized;
}

function stripPassword(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
}
