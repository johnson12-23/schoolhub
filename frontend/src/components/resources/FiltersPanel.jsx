import { CLASS_LEVELS, RESOURCE_TYPES, SUBJECTS } from "../../data/constants";

function FiltersPanel({ filters, onChange, onReset }) {
  return (
    <div className="card-surface p-5">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-slate-900">Filter resources</h3>
        <button type="button" onClick={onReset} className="text-sm font-bold text-brand-green">
          Reset
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Search</span>
          <input
            className="input-field"
            placeholder="Try Maths or BECE"
            value={filters.search}
            onChange={(event) => onChange("search", event.target.value)}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Subject</span>
          <select
            className="input-field"
            value={filters.subject}
            onChange={(event) => onChange("subject", event.target.value)}
          >
            <option value="">All subjects</option>
            {SUBJECTS.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Class</span>
          <select
            className="input-field"
            value={filters.classLevel}
            onChange={(event) => onChange("classLevel", event.target.value)}
          >
            <option value="">All classes</option>
            {CLASS_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Type</span>
          <select
            className="input-field"
            value={filters.type}
            onChange={(event) => onChange("type", event.target.value)}
          >
            <option value="">All types</option>
            {RESOURCE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

export default FiltersPanel;
