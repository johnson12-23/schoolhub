import { AdminShell } from "@/components/admin/AdminShell";
import { ManagementPage } from "@/components/admin/ManagementPage";
import { Badge } from "@/components/ui/Badge";
import { getClasses, getSubjects } from "@/lib/admin-data";

export default async function ClassesPage() {
  const [classes, subjects] = await Promise.all([getClasses(), getSubjects()]);

  return (
    <AdminShell>
      <ManagementPage
        eyebrow="Class & Subject Management"
        title="Classes and Subjects"
        description="Create classes, assign class teachers, add subjects, assign subjects to teachers, and manage weekly timetables."
        primaryAction="Create class"
        columns={["Class", "Level", "Class Teacher", "Students", "Subjects", "Actions"]}
        rows={classes.map((schoolClass) => [
          <p key={schoolClass.id} className="font-extrabold">{schoolClass.name}</p>,
          <Badge key="level" tone="blue">{schoolClass.level}</Badge>,
          schoolClass.class_teacher_name || "Unassigned",
          schoolClass.student_count,
          subjects.slice(0, 2).map((subject) => subject.name).join(", "),
          <div key="actions" className="flex gap-2"><button className="admin-button-secondary px-3 py-2">Timetable</button><button className="admin-button-secondary px-3 py-2">Edit</button></div>
        ])}
      />
    </AdminShell>
  );
}
