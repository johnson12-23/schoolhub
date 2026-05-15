import { NextResponse } from "next/server";
import { getAdminAccess } from "@/lib/admin-auth";
import { studentSchema } from "@/lib/validators/student";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, error: NextResponse.json({ message: "Authentication required" }, { status: 401 }) };
  }

  const { allowed, role } = await getAdminAccess(supabase, user);

  if (!allowed || !["super_admin", "teacher_admin"].includes(role || "")) {
    return { supabase, error: NextResponse.json({ message: "Permission denied" }, { status: 403 }) };
  }

  return { supabase, error: null };
}

export async function GET() {
  const { supabase, error } = await requireAdmin();
  if (error) return error;

  const { data, error: queryError } = await supabase
    .from("students")
    .select("*, classes(name)")
    .order("created_at", { ascending: false });

  if (queryError) {
    return NextResponse.json({ message: queryError.message }, { status: 500 });
  }

  return NextResponse.json({ students: data });
}

export async function POST(request: Request) {
  const { supabase, error } = await requireAdmin();
  if (error) return error;

  const payload = studentSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ message: "Invalid student data", issues: payload.error.flatten() }, { status: 422 });
  }

  const { data, error: insertError } = await supabase
    .from("students")
    .insert(payload.data)
    .select("*")
    .single();

  if (insertError) {
    return NextResponse.json({ message: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ student: data }, { status: 201 });
}
