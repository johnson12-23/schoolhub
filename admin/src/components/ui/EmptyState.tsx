import { Inbox } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="admin-card flex flex-col items-center justify-center p-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-school-sky text-school-blue dark:bg-blue-500/15">
        <Inbox size={24} />
      </div>
      <h3 className="mt-4 text-lg font-extrabold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}
