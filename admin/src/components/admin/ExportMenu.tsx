"use client";

import { Download, FileSpreadsheet, Printer } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

type ExportRow = Record<string, string | number | boolean | null | undefined>;

function toCsv(rows: ExportRow[]) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (value: ExportRow[string]) => `"${String(value ?? "").replaceAll('"', '""')}"`;

  return [headers.join(","), ...rows.map((row) => headers.map((header) => escape(row[header])).join(","))].join("\n");
}

export function ExportMenu({ rows, filename }: { rows: ExportRow[]; filename: string }) {
  const { showToast } = useToast();

  function downloadCsv() {
    const csv = toCsv(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast({ tone: "success", title: "Export ready", description: `${rows.length} records downloaded as CSV.` });
  }

  function printPdf() {
    window.print();
    showToast({ tone: "info", title: "Print dialog opened", description: "Choose Save as PDF to download a report." });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={downloadCsv} className="admin-button-secondary">
        <FileSpreadsheet size={16} /> Excel CSV
      </button>
      <button type="button" onClick={printPdf} className="admin-button-secondary">
        <Printer size={16} /> PDF
      </button>
      <button type="button" onClick={downloadCsv} className="admin-button-secondary md:hidden">
        <Download size={16} /> Export
      </button>
    </div>
  );
}
