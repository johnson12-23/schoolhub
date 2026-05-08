import { AdminShell } from "@/components/admin/AdminShell";
import { ManagementPage } from "@/components/admin/ManagementPage";
import { Badge } from "@/components/ui/Badge";
import { getPayments } from "@/lib/admin-data";
import { formatCurrency } from "@/lib/utils";

export default async function PaymentsPage() {
  const payments = await getPayments();

  return (
    <AdminShell>
      <ManagementPage
        eyebrow="Fees & Payment Management"
        title="Fees and Payments"
        description="Track student payment history, pending fees, invoices, Paystack payment records, and finance statistics."
        primaryAction="Generate invoice"
        columns={["Student", "Amount", "Balance", "Status", "Paystack Ref", "Actions"]}
        rows={payments.map((payment) => [
          <p key={payment.id} className="font-extrabold">{payment.student_name}</p>,
          formatCurrency(payment.amount),
          formatCurrency(payment.balance),
          <Badge key="status" tone={payment.status === "paid" ? "green" : payment.status === "overdue" ? "red" : "amber"}>{payment.status}</Badge>,
          payment.reference,
          <div key="actions" className="flex gap-2"><button className="admin-button-secondary px-3 py-2">Invoice</button><button className="admin-button-secondary px-3 py-2">History</button></div>
        ])}
      />
    </AdminShell>
  );
}
