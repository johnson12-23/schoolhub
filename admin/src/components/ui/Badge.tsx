import { cn } from "@/lib/utils";

const tones = {
  blue: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200",
  green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200",
  red: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-200",
  slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200"
};

export function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: keyof typeof tones }) {
  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-extrabold capitalize", tones[tone])}>
      {children}
    </span>
  );
}
