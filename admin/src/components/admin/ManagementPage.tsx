import { Download, Filter, Plus, Search, Upload } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/admin/PageHeader";

export function ManagementPage({
  eyebrow,
  title,
  description,
  columns,
  rows,
  primaryAction = "Add record",
  children
}: {
  eyebrow: string;
  title: string;
  description: string;
  columns: string[];
  rows: Array<Array<React.ReactNode>>;
  primaryAction?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={
          <div className="flex flex-wrap gap-2">
            <button className="admin-button-secondary"><Upload size={16} /> Import</button>
            <button className="admin-button-secondary"><Download size={16} /> Export</button>
            <button className="admin-button"><Plus size={16} /> {primaryAction}</button>
          </div>
        }
      />

      <div className="admin-card grid gap-3 p-4 md:grid-cols-[1fr_auto_auto]">
        <label className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input className="admin-input pl-11" placeholder={`Search ${title.toLowerCase()}`} />
        </label>
        <button className="admin-button-secondary"><Filter size={16} /> Filter</button>
        <button className="admin-button-secondary">This Term</button>
      </div>

      {children}
      <DataTable columns={columns} rows={rows} />
    </div>
  );
}
