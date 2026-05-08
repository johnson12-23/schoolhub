import { Bell, Image, KeyRound, Mail, Palette, School, UserCog } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { PageHeader } from "@/components/admin/PageHeader";

const settings = [
  { title: "School information", icon: School, fields: ["School name", "Address", "Academic year"] },
  { title: "Logo upload", icon: Image, fields: ["Primary logo", "Favicon", "Document seal"] },
  { title: "Admin profile", icon: UserCog, fields: ["Full name", "Email", "Phone"] },
  { title: "Change password", icon: KeyRound, fields: ["Current password", "New password", "Confirm password"] },
  { title: "SMTP email settings", icon: Mail, fields: ["SMTP host", "SMTP user", "Sender email"] },
  { title: "Notifications", icon: Bell, fields: ["Email alerts", "SMS alerts", "Realtime notifications"] },
  { title: "Theme customization", icon: Palette, fields: ["Primary color", "Accent color", "Dark mode default"] }
];

export default function SettingsPage() {
  return (
    <AdminShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Settings"
          title="School and admin settings"
          description="Manage school identity, logo storage, admin profile, password security, SMTP email, notifications, and theme customization."
          action={<button className="admin-button">Save Settings</button>}
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {settings.map((item) => {
            const Icon = item.icon;
            return (
              <section key={item.title} className="admin-card p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-school-sky text-school-blue dark:bg-blue-500/15">
                    <Icon size={20} />
                  </div>
                  <h2 className="font-extrabold text-school-navy dark:text-white">{item.title}</h2>
                </div>
                <div className="mt-5 space-y-3">
                  {item.fields.map((field) => (
                    <input key={field} className="admin-input" placeholder={field} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </AdminShell>
  );
}
