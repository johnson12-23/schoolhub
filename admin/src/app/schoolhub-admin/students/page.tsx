import { AdminShell } from "@/components/admin/AdminShell";
import { StudentWorkspace } from "@/components/admin/StudentWorkspace";
import { getClasses, getStudents } from "@/lib/admin-data";

export default async function StudentsPage() {
  const [students, classes] = await Promise.all([getStudents(), getClasses()]);

  return (
    <AdminShell>
      <StudentWorkspace students={students} classes={classes} />
    </AdminShell>
  );
}
