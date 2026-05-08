import { AdminShell } from "@/components/admin/AdminShell";
import { ManagementPage } from "@/components/admin/ManagementPage";
import { Badge } from "@/components/ui/Badge";
import { getTeachers } from "@/lib/admin-data";

export default async function TeachersPage() {
  const teachers = await getTeachers();

  return (
    <AdminShell>
      <ManagementPage
        eyebrow="Teacher Management"
        title="Teachers"
        description="Manage teacher records, assigned subjects, classes, salary status, profile images, attendance, and contact details."
        primaryAction="Add teacher"
        columns={["Teacher", "Subjects", "Classes", "Salary", "Attendance", "Actions"]}
        rows={teachers.map((teacher) => [
          <div key={teacher.id}><p className="font-extrabold">{teacher.full_name}</p><p className="text-xs text-slate-500">{teacher.email} • {teacher.phone}</p></div>,
          teacher.subjects.join(", "),
          teacher.classes.join(", "),
          <Badge key="salary" tone={teacher.salary_status === "paid" ? "green" : "amber"}>{teacher.salary_status}</Badge>,
          `${teacher.attendance_rate}%`,
          <div key="actions" className="flex gap-2"><button className="admin-button-secondary px-3 py-2">Assign</button><button className="admin-button-secondary px-3 py-2">Edit</button></div>
        ])}
      />
    </AdminShell>
  );
}
