import { Badge } from "@/components/ui/Badge";

export function DataTable({
  columns,
  rows
}: {
  columns: string[];
  rows: Array<Array<React.ReactNode>>;
}) {
  return (
    <div className="admin-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-5 py-4 font-extrabold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t border-slate-100 dark:border-white/10">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-5 py-4 text-slate-700 dark:text-slate-200">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
        <span>Showing {rows.length} records</span>
        <div className="flex gap-2">
          <button className="admin-button-secondary px-3 py-2">Previous</button>
          <Badge tone="blue">1</Badge>
          <button className="admin-button-secondary px-3 py-2">Next</button>
        </div>
      </div>
    </div>
  );
}
