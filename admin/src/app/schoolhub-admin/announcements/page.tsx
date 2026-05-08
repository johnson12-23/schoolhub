import { Pin } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ManagementPage } from "@/components/admin/ManagementPage";
import { Badge } from "@/components/ui/Badge";
import { getAnnouncements } from "@/lib/admin-data";

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <AdminShell>
      <ManagementPage
        eyebrow="Announcements"
        title="Announcements"
        description="Create rich notices, send updates to students and parents, schedule posts, and pin high-priority announcements."
        primaryAction="Create announcement"
        columns={["Title", "Audience", "Pinned", "Schedule", "Preview", "Actions"]}
        rows={announcements.map((announcement) => [
          <p key={announcement.id} className="font-extrabold">{announcement.title}</p>,
          announcement.audience,
          announcement.pinned ? <Badge key="pin" tone="amber"><Pin size={12} /> Pinned</Badge> : <Badge key="pin">No</Badge>,
          announcement.scheduled_at ? new Date(announcement.scheduled_at).toLocaleDateString() : "Publish now",
          <p key="body" className="max-w-sm truncate">{announcement.body}</p>,
          <div key="actions" className="flex gap-2"><button className="admin-button-secondary px-3 py-2">Edit</button><button className="admin-button-secondary px-3 py-2">Send</button></div>
        ])}
      >
        <section className="admin-card p-5">
          <label className="block">
            <span className="mb-2 block text-sm font-extrabold text-slate-700 dark:text-slate-200">Rich text announcement draft</span>
            <textarea className="admin-input min-h-32" placeholder="Write announcement content for students, parents, or staff..." />
          </label>
        </section>
      </ManagementPage>
    </AdminShell>
  );
}
