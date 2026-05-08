import { Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiRequest } from "../lib/api";

function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [userSearch, setUserSearch] = useState("");
  const [deletingUserId, setDeletingUserId] = useState("");
  const [viewingUser, setViewingUser] = useState(null);
  const [viewingUserId, setViewingUserId] = useState("");
  const [viewingUserLoading, setViewingUserLoading] = useState(false);
  const [roleUpdatingId, setRoleUpdatingId] = useState("");

  useEffect(() => {
    if (user?.role !== "admin") return;

    apiRequest("/users")
      .then((data) => setUsers(data.users))
      .catch((error) => setStatus({ type: "error", message: error.message }));
  }, [user?.role]);

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

  async function handleDeleteUser(userId) {
    if (user?.id === userId) {
      setStatus({ type: "error", message: "You cannot remove your own account." });
      return;
    }

    if (!window.confirm("Are you sure you want to permanently remove this user?")) {
      return;
    }

    setStatus({ type: "", message: "" });
    setDeletingUserId(userId);

    try {
      await apiRequest(`/users/${userId}`, { method: "DELETE" });
      setUsers((current) => current.filter((entry) => entry.id !== userId));
      setStatus({ type: "success", message: "User removed successfully." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setDeletingUserId("");
    }
  }

  async function handleViewUser(userId) {
    setViewingUserLoading(true);
    setViewingUserId(userId);
    setStatus({ type: "", message: "" });

    try {
      const data = await apiRequest(`/users/${userId}`);
      setViewingUser(data.user);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setViewingUserLoading(false);
    }
  }

  function closeUserDetails() {
    setViewingUser(null);
    setViewingUserId("");
  }

  return (
    <div className="container-shell py-12">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-brand-green">Admin console</p>
        <h1 className="text-3xl font-extrabold text-slate-900">Platform administration</h1>
        <p className="text-sm text-slate-600">
          Manage accounts, review registrations, and control access for the SchoolHub platform.
        </p>
      </div>

      {status.message ? (
        <div
          className={`mt-6 rounded-2xl px-4 py-3 text-sm ${
            status.type === "error" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {status.message}
        </div>
      ) : null}

      <section className="mt-10 card-surface overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">User management</h2>
            <p className="text-sm text-slate-500">View all registered users and control roles and access.</p>
          </div>
          <label className="relative block max-w-md">
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
                <th className="px-6 py-3 font-bold">Joined</th>
                <th className="px-6 py-3 font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((entry) => (
                <tr key={entry.id} className="border-t border-slate-100">
                  <td className="px-6 py-4 font-semibold text-slate-800">{entry.name}</td>
                  <td className="px-6 py-4 text-slate-600">{entry.email}</td>
                  <td className="px-6 py-4 capitalize text-slate-600">{entry.role}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(entry.createdAt).toLocaleDateString()} {new Date(entry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="px-6 py-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <button
                      type="button"
                      onClick={() => handleViewUser(entry.id)}
                      disabled={viewingUserLoading && viewingUserId === entry.id}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {viewingUserLoading && viewingUserId === entry.id ? "Loading..." : "View"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteUser(entry.id)}
                      disabled={deletingUserId === entry.id || entry.id === user?.id}
                      className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 size={16} />
                      {deletingUserId === entry.id ? "Deleting..." : "Remove"}
                    </button>
                    {entry.id === user?.id ? (
                      <p className="mt-1 text-xs text-slate-400">You cannot remove your own account here.</p>
                    ) : null}
                  </td>
                </tr>
              ))}
              {!filteredUsers.length ? (
                <tr>
                  <td colSpan="5" className="px-6 py-6 text-slate-500">
                    No users matched your search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      {viewingUser ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="max-w-2xl rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900">User details</h3>
                <p className="mt-1 text-sm text-slate-500">Review account details for {viewingUser.name}.</p>
              </div>
              <button
                type="button"
                onClick={closeUserDetails}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Name</p>
                <p className="mt-1 font-semibold text-slate-900">{viewingUser.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="mt-1 font-semibold text-slate-900">{viewingUser.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Role</p>
                <p className="mt-1 font-semibold capitalize text-slate-900">{viewingUser.role}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Joined</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {new Date(viewingUser.createdAt).toLocaleDateString()} at {new Date(viewingUser.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button type="button" onClick={closeUserDetails} className="btn-primary rounded-full px-5 py-2.5">
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AdminPage;
