"use client";

import { Eye, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { ExportMenu } from "@/components/admin/ExportMenu";
import { PageHeader } from "@/components/admin/PageHeader";
import { StorageUploadField } from "@/components/admin/StorageUploadField";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/ToastProvider";
import { generateStudentId } from "@/lib/utils";
import type { SchoolClass, Student } from "@/types/admin";

type StudentDraft = {
  full_name: string;
  gender: string;
  date_of_birth: string;
  class_id: string;
  email: string;
  phone: string;
  address: string;
  guardian_name: string;
  guardian_phone: string;
  guardian_email: string;
  admission_number: string;
  photo_url?: string | null;
};

function createDraft(classes: SchoolClass[], count: number): StudentDraft {
  const defaultClass = classes[0];
  return {
    full_name: "",
    gender: "Female",
    date_of_birth: "",
    class_id: defaultClass?.id || "",
    email: "",
    phone: "",
    address: "",
    guardian_name: "",
    guardian_phone: "",
    guardian_email: "",
    admission_number: generateStudentId(defaultClass?.name || "SchoolHub", count),
    photo_url: null
  };
}

export function StudentWorkspace({ students, classes }: { students: Student[]; classes: SchoolClass[] }) {
  const [records, setRecords] = useState(students);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [profile, setProfile] = useState<Student | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<StudentDraft>(() => createDraft(classes, students.length));
  const { showToast } = useToast();

  const filteredStudents = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return records.filter((student) => {
      const matchesSearch =
        !keyword ||
        student.full_name.toLowerCase().includes(keyword) ||
        student.email.toLowerCase().includes(keyword) ||
        student.admission_number.toLowerCase().includes(keyword) ||
        student.guardian_name.toLowerCase().includes(keyword);
      const matchesClass = !classFilter || student.class_id === classFilter || student.class_name === classFilter;
      return matchesSearch && matchesClass;
    });
  }, [classFilter, records, search]);

  function resetDraft() {
    setDraft(createDraft(classes, records.length));
  }

  function handleAddStudent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const selectedClass = classes.find((entry) => entry.id === draft.class_id);
    const student: Student = {
      ...draft,
      id: crypto.randomUUID(),
      class_name: selectedClass?.name || draft.class_id,
      created_at: new Date().toISOString()
    };

    setRecords((current) => [student, ...current]);
    setAdding(false);
    resetDraft();
    showToast({ tone: "success", title: "Student added", description: `${student.full_name} is ready to sync with Supabase.` });
  }

  function handleDeleteStudent(student: Student) {
    setRecords((current) => current.filter((entry) => entry.id !== student.id));
    showToast({ tone: "info", title: "Student removed from view", description: "Wire DELETE /api/admin/students/:id for permanent removal." });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Student Management"
        title="Students"
        description="Add, edit, delete, search, filter, upload photos, generate student IDs, and manage parent or guardian details."
        action={
          <div className="flex flex-wrap gap-2">
            <ExportMenu
              filename="schoolhub-students"
              rows={filteredStudents.map((student) => ({
                admission_number: student.admission_number,
                full_name: student.full_name,
                class: student.class_name || student.class_id,
                email: student.email,
                phone: student.phone,
                guardian: student.guardian_name,
                guardian_phone: student.guardian_phone
              }))}
            />
            <button type="button" className="admin-button" onClick={() => setAdding(true)}>
              <Plus size={16} /> Add student
            </button>
          </div>
        }
      />

      <div className="admin-card grid gap-3 p-4 md:grid-cols-[1fr_16rem_auto]">
        <label className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="admin-input pl-11"
            placeholder="Search name, email, admission number, guardian..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <select className="admin-input" value={classFilter} onChange={(event) => setClassFilter(event.target.value)}>
          <option value="">All classes</option>
          {classes.map((schoolClass) => (
            <option key={schoolClass.id} value={schoolClass.id}>
              {schoolClass.name}
            </option>
          ))}
        </select>
        <button type="button" className="admin-button-secondary" onClick={() => { setSearch(""); setClassFilter(""); }}>
          Reset
        </button>
      </div>

      <DataTable
        columns={["Student", "Class", "Guardian", "Contact", "Admission No.", "Actions"]}
        rows={filteredStudents.map((student) => [
          <div key={student.id}>
            <p className="font-extrabold">{student.full_name}</p>
            <p className="text-xs text-slate-500">{student.gender} - DOB {student.date_of_birth}</p>
          </div>,
          <Badge key="class" tone="blue">{student.class_name || student.class_id}</Badge>,
          <div key="guardian"><p className="font-bold">{student.guardian_name}</p><p className="text-xs text-slate-500">{student.guardian_phone}</p></div>,
          <div key="contact"><p>{student.email}</p><p className="text-xs text-slate-500">{student.phone}</p></div>,
          student.admission_number,
          <div key="actions" className="flex flex-wrap gap-2">
            <button type="button" className="admin-button-secondary px-3 py-2" onClick={() => setProfile(student)}>
              <Eye size={15} /> Profile
            </button>
            <button type="button" className="admin-button-secondary px-3 py-2 text-red-600" onClick={() => handleDeleteStudent(student)}>
              <Trash2 size={15} /> Delete
            </button>
          </div>
        ])}
      />

      {profile ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="admin-card max-h-[90vh] w-full max-w-3xl overflow-y-auto p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-school-blue">Student profile</p>
                <h2 className="mt-2 text-2xl font-extrabold text-school-navy dark:text-white">{profile.full_name}</h2>
                <p className="text-sm text-slate-500">{profile.admission_number}</p>
              </div>
              <button type="button" className="admin-button-secondary" onClick={() => setProfile(null)}>Close</button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["Class", profile.class_name || profile.class_id],
                ["Email", profile.email],
                ["Phone", profile.phone],
                ["Address", profile.address],
                ["Guardian", profile.guardian_name],
                ["Guardian phone", profile.guardian_phone],
                ["Guardian email", profile.guardian_email],
                ["Registered", new Date(profile.created_at).toLocaleString()]
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
                  <p className="mt-1 font-bold text-slate-800 dark:text-slate-100">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {adding ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <form onSubmit={handleAddStudent} className="admin-card max-h-[92vh] w-full max-w-4xl overflow-y-auto p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-school-blue">New admission</p>
                <h2 className="mt-2 text-2xl font-extrabold text-school-navy dark:text-white">Add student</h2>
              </div>
              <button type="button" className="admin-button-secondary" onClick={() => setAdding(false)}>Cancel</button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input className="admin-input" required placeholder="Full name" value={draft.full_name} onChange={(event) => setDraft({ ...draft, full_name: event.target.value })} />
              <select className="admin-input" value={draft.gender} onChange={(event) => setDraft({ ...draft, gender: event.target.value })}>
                <option>Female</option>
                <option>Male</option>
              </select>
              <input className="admin-input" required type="date" value={draft.date_of_birth} onChange={(event) => setDraft({ ...draft, date_of_birth: event.target.value })} />
              <select className="admin-input" value={draft.class_id} onChange={(event) => setDraft({ ...draft, class_id: event.target.value })}>
                {classes.map((schoolClass) => <option key={schoolClass.id} value={schoolClass.id}>{schoolClass.name}</option>)}
              </select>
              <input className="admin-input" required type="email" placeholder="Student email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} />
              <input className="admin-input" required placeholder="Student phone" value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} />
              <input className="admin-input md:col-span-2" required placeholder="Address" value={draft.address} onChange={(event) => setDraft({ ...draft, address: event.target.value })} />
              <input className="admin-input" required placeholder="Guardian name" value={draft.guardian_name} onChange={(event) => setDraft({ ...draft, guardian_name: event.target.value })} />
              <input className="admin-input" required placeholder="Guardian phone" value={draft.guardian_phone} onChange={(event) => setDraft({ ...draft, guardian_phone: event.target.value })} />
              <input className="admin-input" required type="email" placeholder="Guardian email" value={draft.guardian_email} onChange={(event) => setDraft({ ...draft, guardian_email: event.target.value })} />
              <input className="admin-input" required placeholder="Admission number" value={draft.admission_number} onChange={(event) => setDraft({ ...draft, admission_number: event.target.value })} />
              <div className="md:col-span-2">
                <StorageUploadField onUploaded={(url) => setDraft({ ...draft, photo_url: url })} />
                {draft.photo_url ? <p className="mt-2 text-xs font-bold text-emerald-600">Photo URL attached.</p> : null}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button type="submit" className="admin-button">Save student</button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
