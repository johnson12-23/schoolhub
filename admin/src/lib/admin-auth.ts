import type { SupabaseClient, User } from "@supabase/supabase-js";

const adminRoles = ["super_admin", "teacher_admin", "accountant_admin", "moderator"];

export async function getAdminAccess(supabase: SupabaseClient, user: User) {
  const metadataRole = user.app_metadata?.admin_role || user.app_metadata?.role;

  if (typeof metadataRole === "string" && adminRoles.includes(metadataRole)) {
    return { allowed: true, role: metadataRole };
  }

  const { data: legacyUser, error: legacyError } = await supabase
    .from("users")
    .select("id, role")
    .eq("email", user.email)
    .eq("role", "admin")
    .maybeSingle();

  if (!legacyError && legacyUser?.role === "admin") {
    return { allowed: true, role: "super_admin" };
  }

  const { data: admin, error: adminError } = await supabase
    .from("admins")
    .select("id, role, status")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!adminError && admin?.status === "active" && adminRoles.includes(admin.role)) {
    return { allowed: true, role: admin.role };
  }

  return { allowed: false, role: null };
}
