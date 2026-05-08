import { AdminShell } from "@/components/admin/AdminShell";
import { AttendanceChart } from "@/components/admin/Charts";
import { ManagementPage } from "@/components/admin/ManagementPage";
import { Badge } from "@/components/ui/Badge";
import { students } from "@/lib/demo-data";

export default function AttendancePage() {
  return (
    <AdminShell>
      <ManagementPage
        eyebrow="Attendance Management"
        title="Attendance"
        description="Mark daily attendance, track present, absent, and late status, and review attendance history by class and date."
        primaryAction="Mark attendance"
        columns={["Student", "Class", "Today", "Month Rate", "Last Updated", "Actions"]}
        rows={students.map((student, index) => [
          <p key={student.id} className="font-extrabold">{student.full_name}</p>,
          student.class_name,
          <Badge key="status" tone={index === 0 ? "green" : "amber"}>{index === 0 ? "present" : "late"}</Badge>,
          index === 0 ? "96%" : "91%",
          "Today, 8:12 AM",
          <button key="action" className="admin-button-secondary px-3 py-2">History</button>
        ])}
      >
        <section className="admin-card p-6">
          <h2 className="text-xl font-extrabold text-school-navy dark:text-white">Attendance Statistics</h2>
          <div className="mt-4"><AttendanceChart /></div>
        </section>
      </ManagementPage>
    </AdminShell>
  );
}
