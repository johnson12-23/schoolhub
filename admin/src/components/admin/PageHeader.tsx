export function PageHeader({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-school-blue">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-extrabold text-school-navy dark:text-white md:text-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      {action}
    </div>
  );
}
