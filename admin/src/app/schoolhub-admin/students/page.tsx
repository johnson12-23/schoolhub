import { AdminShell } from "@/components/admin/AdminShell";
import { ManagementPage } from "@/components/admin/ManagementPage";
import { Badge } from "@/components/ui/Badge";
import { getStudents } from "@/lib/admin-data";

export default async function StudentsPage() {
  const students = await getStudents();

  return (
    <AdminShell>
      <ManagementPage
        eyebrow="Student Management"
        title="Students"
        description="Add, edit, delete, search, filter, upload photos, generate student IDs, and manage parent or guardian details."
        primaryAction="Add student"
        columns={["Student", "Class", "Guardian", "Contact", "Admission No.", "Actions"]}
        rows={students.map((student) => [
          <div key={student.id}><p className="font-extrabold">{student.full_name}</p><p className="text-xs text-slate-500">{student.gender} • DOB {student.date_of_birth}</p></div>,
          <Badge key="class" tone="blue">{student.class_name || student.class_id}</Badge>,
          <div key="guardian"><p className="font-bold">{student.guardian_name}</p><p className="text-xs text-slate-500">{student.guardian_phone}</p></div>,
          <div key="contact"><p>{student.email}</p><p className="text-xs text-slate-500">{student.phone}</p></div>,
          student.admission_number,
          <div key="actions" className="flex gap-2"><button className="admin-button-secondary px-3 py-2">Profile</button><button className="admin-button-secondary px-3 py-2">Edit</button></div>
        ])}
      />
    </AdminShell>
  );
}
