import { useState } from "react";
import { CLASS_LEVELS, RESOURCE_TYPES, SUBJECTS } from "../data/constants";
import { apiRequest } from "../lib/api";

function UploadPage() {
  const [form, setForm] = useState({
    title: "",
    subject: SUBJECTS[0],
    classLevel: CLASS_LEVELS[0],
    type: RESOURCE_TYPES[0],
    description: ""
  });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!file) {
      setStatus({ type: "error", message: "Please choose a PDF file to upload." });
      return;
    }

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value));
    payload.append("resource", file);

    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      await apiRequest("/resources", {
        method: "POST",
        body: payload
      });

      setForm({
        title: "",
        subject: SUBJECTS[0],
        classLevel: CLASS_LEVELS[0],
        type: RESOURCE_TYPES[0],
        description: ""
      });
      setFile(null);
      setStatus({ type: "success", message: "Resource uploaded successfully." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-shell py-12">
      <div className="mx-auto max-w-3xl card-surface p-8">
        <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-brand-green">Teacher upload</p>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900">Upload a new PDF resource</h1>
        <p className="mt-2 text-sm text-slate-600">
          Add clear descriptions so students can find the right material quickly on mobile.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5 md:grid-cols-2">
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-bold text-slate-700">Title</span>
            <input
              className="input-field"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder="JHS 3 Mathematics Revision Pack"
              required
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Subject</span>
            <select
              className="input-field"
              value={form.subject}
              onChange={(event) => setForm({ ...form, subject: event.target.value })}
            >
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
              value={form.classLevel}
              onChange={(event) => setForm({ ...form, classLevel: event.target.value })}
            >
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
              value={form.type}
              onChange={(event) => setForm({ ...form, type: event.target.value })}
            >
              {RESOURCE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">PDF file</span>
            <input
              type="file"
              accept="application/pdf"
              className="input-field file:mr-4 file:rounded-full file:border-0 file:bg-brand-green file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
              required
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-bold text-slate-700">Description</span>
            <textarea
              className="input-field min-h-32"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              placeholder="Briefly explain what students will learn from this PDF."
              required
            />
          </label>

          {status.message ? (
            <div
              className={`md:col-span-2 rounded-2xl px-4 py-3 text-sm ${
                status.type === "error" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {status.message}
            </div>
          ) : null}

          <div className="md:col-span-2">
            <button type="submit" className="btn-primary w-full sm:w-auto" disabled={submitting}>
              {submitting ? "Uploading..." : "Upload resource"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadPage;

