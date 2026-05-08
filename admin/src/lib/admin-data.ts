import "server-only";
import { createClient } from "@/lib/supabase/server";
import {
  announcements,
  classes,
  messages,
  payments,
  students,
  subjects,
  teachers
} from "@/lib/demo-data";

async function safeQuery<T>(table: string, fallback: T[]) {
  const supabase = await createClient();
  const { data, error } = await supabase.from(table).select("*").limit(100);

  if (error || !data?.length) {
    return fallback;
  }

  return data as T[];
}

export async function getStudents() {
  return safeQuery("students", students);
}

export async function getTeachers() {
  return safeQuery("teachers", teachers);
}

export async function getClasses() {
  return safeQuery("classes", classes);
}

export async function getSubjects() {
  return safeQuery("subjects", subjects);
}

export async function getPayments() {
  return safeQuery("payments", payments);
}

export async function getAnnouncements() {
  return safeQuery("announcements", announcements);
}

export async function getMessages() {
  return safeQuery("messages", messages);
}
