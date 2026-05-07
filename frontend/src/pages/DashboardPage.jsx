import { Download, FileText, Save, Search, Trash2, UploadCloud, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ResourceCard from "../components/resources/ResourceCard";
import PaginationControls from "../components/ui/PaginationControls";
import { CLASS_LEVELS, RESOURCE_TYPES, SUBJECTS } from "../data/constants";
import { useAuth } from "../contexts/AuthContext";
import { apiRequest } from "../lib/api";

function DashboardPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [managedResources, setManagedResources] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingManaged, setLoadingManaged] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [savingId, setSavingId] = useState("");
  const [roleUpdatingId, setRoleUpdatingId] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [resourceSearch, setResourceSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [editingResourceId, setEditingResourceId] = useState("");
  const [managePage, setManagePage] = useState(1);
  const [manageReloadKey, setManageReloadKey] = useState(0);
  const [managePagination, setManagePagination] = useState({
    page: 1,
    pageSize: 5,
    total: 0,
    totalPages: 1
  });
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    subject: SUBJECTS[0],
    classLevel: CLASS_LEVELS[0],
    type: RESOURCE_TYPES[0]
  });

  useEffect(() => {
    apiRequest("/resources?page=1&pageSize=6").then((data) => setResources(data.resources));

    if (user?.role === "admin") {
      apiRequest("/users").then((data) => setUsers(data.users));
    }
  }, [user?.role]);

  useEffect(() => {
    if (user?.role !== "teacher" && user?.role !== "admin") {
      return;
    }

    setLoadingManaged(true);
    const query = new URLSearchParams({
      page: String(managePage),
      pageSize: "5"
    });

    if (resourceSearch.trim()) {
      query.set("search", resourceSearch.trim());
    }

    apiRequest(`/resources/manage?${query.toString()}`)
      .then((data) => {
        setManagedResources(data.resources);
        setManagePagination(data.pagination);
      })
      .finally(() => setLoadingManaged(false));
  }, [managePage, manageReloadKey, resourceSearch, user?.role]);

  const filteredUsers = useMemo(() => {
    const keyword = userSearch.trim().toLowerCase();
    if (!keyword) return users;

    return users.filter(
      (entry) =>
        entry.name.toLowerCase().includes(keyword) ||
        entry.email.toLowerCase().includes(keyword) ||
        entry.role.toLowerCase().includes(keyword)
    );
  }, [userSearch, users]);

  async function handleDelete(resourceId) {
    setStatus({ type: "", message: "" });
    setDeletingId(resourceId);

    try {
      await apiRequest(`/resources/${resourceId}`, { method: "DELETE" });
      setResources((current) => current.filter((resource) => resource.id !== resourceId));
      setStatus({ type: "success", message: "Resource deleted successfully." });
      setManagePage((current) => {
        const wouldBeEmpty = managedResources.length === 1 && current > 1;
        return wouldBeEmpty ? current - 1 : current;
      });
      setManageReloadKey((current) => current + 1);
      if (editingResourceId === resourceId) {
        cancelEditing();
      }
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setDeletingId("");
    }
  }

  function startEditing(resource) {
    setEditingResourceId(resource.id);
    setEditForm({
      title: resource.title,
      description: resource.description,
      subject: resource.subject,
      classLevel: resource.classLevel,
      type: resource.type
    });
    setStatus({ type: "", message: "" });
  }

  function cancelEditing() {
    setEditingResourceId("");
    setEditForm({
      title: "",
      description: "",
      subject: SUBJECTS[0],
      classLevel: CLASS_LEVELS[0],
      type: RESOURCE_TYPES[0]
    });
  }

  async function handleUpdateResource(resourceId) {
    setStatus({ type: "", message: "" });
    setSavingId(resourceId);

    try {
      const data = await apiRequest(`/resources/${resourceId}`, {
        method: "PUT",
        body: JSON.stringify(editForm)
      });

      setManagedResources((current) =>
        current.map((resource) => (resource.id === resourceId ? data.resource : resource))
      );
      setResources((current) =>
        current.map((resource) => (resource.id === resourceId ? data.resource : resource))
      );
      setStatus({ type: "success", message: "Resource updated successfully." });
      setManageReloadKey((current) => current + 1);
      cancelEditing();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSavingId("");
    }
  }

  async function handleRoleChange(userId, role) {
    setStatus({ type: "", message: "" });
    setRoleUpdatingId(userId);

    try {
      const data = await apiRequest(`/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role })
      });

      setUsers((current) => current.map((entry) => (entry.id === userId ? data.user : entry)));
      setStatus({ type: "success", message: "User role updated successfully." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setRoleUpdatingId("");
    }
  }

  const stats = [
    {
      title: "Resources ready",
      value:
        user?.role === "teacher" || user?.role === "admin" ? managePagination.total : resources.length,
      icon: FileText,
      tone: "bg-emerald-50 text-emerald-700"
    },
    {
      title: user?.role === "student" ? "Downloads available" : "Upload access",
      value: user?.role === "student" ? "Open library" : "Enabled",
      icon: user?.role === "student" ? Download : UploadCloud,
      tone: "bg-amber-50 text-amber-700"
    },
    {
      title: "Role",
      value: user?.role,
      icon: Users,
      tone: "bg-sky-50 text-sky-700"
    }
  ];

  return (
    <div className="container-shell py-12">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-brand-green">Dashboard</p>
        <h1 className="text-3xl font-extrabold text-slate-900">Hello, {user?.name}</h1>
        <p className="text-sm text-slate-600">
          {user?.role === "student" &&
            "Browse study materials, open PDFs, and prepare for class tests or BECE."}
          {user?.role === "teacher" &&
            "Upload new teaching materials, update their details, and manage your library from one place."}
          {user?.role === "admin" &&
            "Review platform activity, edit content, and manage users and access levels."}
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {stats.map((stat) => (
          <article key={stat.title} className="card-surface p-6">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.tone}`}>
              <stat.icon size={22} />
            </div>
            <p className="mt-5 text-sm font-bold uppercase tracking-wide text-slate-500">{stat.title}</p>
            <h2 className="mt-2 text-2xl font-extrabold capitalize text-slate-900">{stat.value}</h2>
          </article>
        ))}
      </div>

      <section className="mt-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-slate-900">
            {user?.role === "teacher" || user?.role === "admin" ? "Recent resources" : "Recommended for you"}
          </h2>
          {(user?.role === "teacher" || user?.role === "admin") && (
            <Link to="/upload" className="btn-secondary px-4 py-2">
              Upload another PDF
            </Link>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </section>

      {(user?.role === "teacher" || user?.role === "admin") && (
        <section className="mt-10">
          <div className="card-surface overflow-hidden">
            <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  {user?.role === "admin" ? "Content management" : "My uploaded resources"}
                </h2>
                <p className="text-sm text-slate-500">
                  Search, edit, or remove resources without leaving the dashboard.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    className="input-field pl-9"
                    placeholder="Search resources"
                    value={resourceSearch}
                    onChange={(event) => {
                      setResourceSearch(event.target.value);
                      setManagePage(1);
                    }}
                  />
                </label>
                <Link to="/upload" className="btn-primary px-4 py-2">
                  Upload new resource
                </Link>
              </div>
            </div>

            {status.message ? (
              <div
                className={`mx-6 mt-4 rounded-2xl px-4 py-3 text-sm ${
                  status.type === "error" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {status.message}
              </div>
            ) : null}

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-bold">Title</th>
                    <th className="px-6 py-3 font-bold">Subject</th>
                    <th className="px-6 py-3 font-bold">Class</th>
                    <th className="px-6 py-3 font-bold">Type</th>
                    <th className="px-6 py-3 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingManaged ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-6 text-slate-500">
                        Loading managed resources...
                      </td>
                    </tr>
                  ) : managedResources.length ? (
                    managedResources.map((resource) => {
                      const isEditing = editingResourceId === resource.id;

                      return (
                        <tr key={resource.id} className="border-t border-slate-100 align-top">
                          <td className="px-6 py-4">
                            {isEditing ? (
                              <div className="space-y-3">
                                <input
                                  className="input-field"
                                  value={editForm.title}
                                  onChange={(event) => setEditForm({ ...editForm, title: event.target.value })}
                                />
                                <textarea
                                  className="input-field min-h-28"
                                  value={editForm.description}
                                  onChange={(event) =>
                                    setEditForm({ ...editForm, description: event.target.value })
                                  }
                                />
                              </div>
                            ) : (
                              <div>
                                <p className="font-semibold text-slate-800">{resource.title}</p>
                                <p className="mt-1 max-w-md text-xs text-slate-500">{resource.description}</p>
                                <a
                                  href={resource.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-2 inline-block text-xs font-bold text-brand-green"
                                >
                                  Open PDF
                                </a>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {isEditing ? (
                              <select
                                className="input-field"
                                value={editForm.subject}
                                onChange={(event) => setEditForm({ ...editForm, subject: event.target.value })}
                              >
                                {SUBJECTS.map((subject) => (
                                  <option key={subject} value={subject}>
                                    {subject}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              resource.subject
                            )}
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {isEditing ? (
                              <select
                                className="input-field"
                                value={editForm.classLevel}
                                onChange={(event) =>
                                  setEditForm({ ...editForm, classLevel: event.target.value })
                                }
                              >
                                {CLASS_LEVELS.map((level) => (
                                  <option key={level} value={level}>
                                    {level}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              resource.classLevel
                            )}
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {isEditing ? (
                              <select
                                className="input-field"
                                value={editForm.type}
                                onChange={(event) => setEditForm({ ...editForm, type: event.target.value })}
                              >
                                {RESOURCE_TYPES.map((type) => (
                                  <option key={type} value={type}>
                                    {type}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              resource.type
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                              {isEditing ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateResource(resource.id)}
                                    disabled={savingId === resource.id}
                                    className="inline-flex items-center gap-2 rounded-full bg-brand-green px-4 py-2 font-bold text-white transition hover:bg-brand-dark disabled:opacity-60"
                                  >
                                    <Save size={16} />
                                    {savingId === resource.id ? "Saving..." : "Save"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={cancelEditing}
                                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 font-bold text-slate-600 transition hover:bg-slate-50"
                                  >
                                    <X size={16} />
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => startEditing(resource)}
                                    className="rounded-full border border-brand-green/20 px-4 py-2 font-bold text-brand-green transition hover:bg-brand-green/5"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(resource.id)}
                                    disabled={deletingId === resource.id}
                                    className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    <Trash2 size={16} />
                                    {deletingId === resource.id ? "Deleting..." : "Delete"}
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-6 text-slate-500">
                        No matching managed resources found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 pb-6">
              <PaginationControls
                page={managePagination.page}
                totalPages={managePagination.totalPages}
                onPageChange={setManagePage}
                disabled={loadingManaged}
              />
            </div>
          </div>
        </section>
      )}

      {user?.role === "admin" && (
        <section className="mt-10">
          <div className="card-surface overflow-hidden">
            <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">User management</h2>
                <p className="text-sm text-slate-500">Search users and update their access level.</p>
              </div>
              <label className="relative block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  className="input-field pl-9"
                  placeholder="Search users"
                  value={userSearch}
                  onChange={(event) => setUserSearch(event.target.value)}
                />
              </label>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-bold">Name</th>
                    <th className="px-6 py-3 font-bold">Email</th>
                    <th className="px-6 py-3 font-bold">Role</th>
                    <th className="px-6 py-3 font-bold">Change role</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((entry) => (
                    <tr key={entry.id} className="border-t border-slate-100">
                      <td className="px-6 py-4 font-semibold text-slate-800">{entry.name}</td>
                      <td className="px-6 py-4 text-slate-600">{entry.email}</td>
                      <td className="px-6 py-4 capitalize text-slate-600">{entry.role}</td>
                      <td className="px-6 py-4">
                        <select
                          className="input-field max-w-44"
                          value={entry.role}
                          onChange={(event) => handleRoleChange(entry.id, event.target.value)}
                          disabled={roleUpdatingId === entry.id || entry.id === user?.id}
                        >
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                          <option value="admin">Admin</option>
                        </select>
                        {entry.id === user?.id ? (
                          <p className="mt-1 text-xs text-slate-400">You cannot change your own role here.</p>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                  {!filteredUsers.length ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-6 text-slate-500">
                        No users matched your search.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default DashboardPage;
