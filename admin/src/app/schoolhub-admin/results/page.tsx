import { AdminShell } from "@/components/admin/AdminShell";
import { PerformanceChart } from "@/components/admin/Charts";
import { ManagementPage } from "@/components/admin/ManagementPage";
import { Badge } from "@/components/ui/Badge";
import { students } from "@/lib/demo-data";

export default function ResultsPage() {
  return (
    <AdminShell>
      <ManagementPage
        eyebrow="Results & Examination"
        title="Results"
        description="Upload exam scores, calculate GPA, generate report cards, analyze performance, and download printable result slips."
        primaryAction="Upload scores"
        columns={["Student", "Class", "Average", "GPA", "Status", "Actions"]}
        rows={students.map((student, index) => [
          <p key={student.id} className="font-extrabold">{student.full_name}</p>,
          student.class_name,
          index === 0 ? "86%" : "79%",
          index === 0 ? "3.7" : "3.2",
          <Badge key="status" tone="green">Promoted</Badge>,
          <div key="actions" className="flex gap-2"><button className="admin-button-secondary px-3 py-2">Report Card</button><button className="admin-button-secondary px-3 py-2">Slip</button></div>
        ])}
      >
        <section className="admin-card p-6">
          <h2 className="text-xl font-extrabold text-school-navy dark:text-white">Student Performance Analytics</h2>
          <div className="mt-4"><PerformanceChart /></div>
        </section>
      </ManagementPage>
    </AdminShell>
  );
}
