import { BookText, Download, FileQuestion, Presentation, Shapes } from "lucide-react";

const typeConfig = {
  Textbook: {
    icon: BookText,
    badge: "bg-emerald-50 text-emerald-700"
  },
  Slides: {
    icon: Presentation,
    badge: "bg-amber-50 text-amber-700"
  },
  "Past Questions": {
    icon: FileQuestion,
    badge: "bg-sky-50 text-sky-700"
  }
};

function ResourceCard({ resource }) {
  const config = typeConfig[resource.type] || { icon: Shapes, badge: "bg-slate-100 text-slate-700" };
  const Icon = config.icon;

  return (
    <article className="card-surface flex h-full flex-col p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-green">
          <Icon size={22} />
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${config.badge}`}>{resource.type}</span>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-extrabold text-slate-900">{resource.title}</h3>
        <p className="text-sm text-slate-600">{resource.description}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{resource.subject}</span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{resource.classLevel}</span>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">{resource.fileName || "PDF document"}</p>
        <a
          href={resource.fileUrl}
          className="btn-primary gap-2 px-4 py-2"
          target="_blank"
          rel="noreferrer"
        >
          <Download size={16} /> Open
        </a>
      </div>
    </article>
  );
}

export default ResourceCard;

