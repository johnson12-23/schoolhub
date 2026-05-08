import { AdminShell } from "@/components/admin/AdminShell";
import { ManagementPage } from "@/components/admin/ManagementPage";
import { Badge } from "@/components/ui/Badge";
import { getMessages } from "@/lib/admin-data";

export default async function MessagesPage() {
  const messages = await getMessages();

  return (
    <AdminShell>
      <ManagementPage
        eyebrow="Contact & Messages"
        title="Messages"
        description="View contact submissions, mark messages as read or unread, reply to families, and filter support conversations."
        primaryAction="Compose reply"
        columns={["Sender", "Subject", "Message", "Status", "Received", "Actions"]}
        rows={messages.map((message) => [
          <div key={message.id}><p className="font-extrabold">{message.name}</p><p className="text-xs text-slate-500">{message.email}</p></div>,
          message.subject,
          <p key="body" className="max-w-sm truncate">{message.body}</p>,
          <Badge key="status" tone={message.status === "unread" ? "blue" : "slate"}>{message.status}</Badge>,
          new Date(message.created_at).toLocaleString(),
          <div key="actions" className="flex gap-2"><button className="admin-button-secondary px-3 py-2">Reply</button><button className="admin-button-secondary px-3 py-2">Toggle</button></div>
        ])}
      />
    </AdminShell>
  );
}
