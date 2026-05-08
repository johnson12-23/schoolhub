import { ShieldCheck } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ManagementPage } from "@/components/admin/ManagementPage";
import { Badge } from "@/components/ui/Badge";

const admins = [
  ["Super Admin", "Full platform access", "students, teachers, finance, settings, roles"],
  ["Teacher Admin", "Academic operations", "students, classes, attendance, results"],
  ["Accountant Admin", "Finance operations", "payments, invoices, reports"],
  ["Moderator", "Communication operations", "announcements, messages"]
];

export default function AdminUsersPage() {
  return (
    <AdminShell>
      <ManagementPage
        eyebrow="Admin Users & Roles"
        title="Roles and Permissions"
        description="Create secure admin accounts, assign role permissions, and enforce least-privilege access for school operations."
        primaryAction="Invite admin"
        columns={["Role", "Access Level", "Permissions", "Status", "Actions"]}
        rows={admins.map(([role, access, permissions]) => [
          <div key={role} className="flex items-center gap-3"><ShieldCheck className="text-school-blue" size={18} /><p className="font-extrabold">{role}</p></div>,
          access,
          permissions,
          <Badge key="status" tone="green">Active</Badge>,
          <div key="actions" className="flex gap-2"><button className="admin-button-secondary px-3 py-2">Permissions</button><button className="admin-button-secondary px-3 py-2">Edit</button></div>
        ])}
      />
    </AdminShell>
  );
}
