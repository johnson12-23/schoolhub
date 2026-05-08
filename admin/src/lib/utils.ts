import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0
  }).format(amount);
}

export function generateStudentId(className: string, count: number) {
  const classCode = className.replace(/[^a-z0-9]/gi, "").slice(0, 4).toUpperCase() || "SCH";
  const sequence = String(count + 1).padStart(4, "0");
  return `SH-${classCode}-${new Date().getFullYear()}-${sequence}`;
}
