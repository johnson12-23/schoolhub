import { BookOpen, LayoutDashboard, LogOut, Menu, ShieldCheck, Upload } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const links = [
  { to: "/home", label: "Home" },
  { to: "/resources", label: "Resources" }
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const { impersonatingAdmin, isAuthenticated, isImpersonating, logout, returnToAdmin, user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/85 backdrop-blur">
      {isImpersonating ? (
        <div className="bg-amber-50 text-amber-900">
          <div className="container-shell flex flex-col gap-2 py-2 text-sm font-semibold sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck size={17} />
              <span>
                {impersonatingAdmin?.name} is accessing {user?.name}'s {user?.role} account.
              </span>
            </div>
            <button
              type="button"
              onClick={returnToAdmin}
              className="self-start rounded-full bg-white px-4 py-1.5 text-xs font-extrabold text-amber-900 ring-1 ring-amber-200 transition hover:bg-amber-100 sm:self-auto"
            >
              Return to admin
            </button>
          </div>
        </div>
      ) : null}
      <div className="container-shell flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-green text-white shadow-soft">
            <BookOpen size={22} />
          </div>
          <div>
            <p className="font-display text-lg font-extrabold text-brand-dark">SchoolHub</p>
            <p className="text-xs text-slate-500">Learn anywhere in Ghana</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {isAuthenticated && (
            <>
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-semibold transition ${
                      isActive ? "bg-brand-green text-white" : "text-slate-600 hover:bg-slate-100"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <NavLink
                to="/dashboard"
                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                Dashboard
              </NavLink>
              {user?.role === "admin" && (
                <NavLink
                  to="/admin"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  Admin
                </NavLink>
              )}
              {(user?.role === "teacher" || user?.role === "admin") && (
                <NavLink
                  to="/upload"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  Upload
                </NavLink>
              )}
            </>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                <p className="text-xs capitalize text-slate-500">{user?.role}</p>
              </div>
              <button type="button" onClick={logout} className="btn-secondary px-4 py-2">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary px-4 py-2">
                Login
              </Link>
              <Link to="/register" className="btn-primary px-4 py-2">
                Join Now
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-2xl p-2 text-slate-700 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white md:hidden">
          <div className="container-shell flex flex-col gap-2 py-4">
            {isAuthenticated ? (
              <>
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                ))}
                <NavLink
                  to="/dashboard"
                  className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  onClick={() => setOpen(false)}
                >
                  <LayoutDashboard size={18} /> Dashboard
                </NavLink>
                {user?.role === "admin" && (
                  <NavLink
                    to="/admin"
                    className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    onClick={() => setOpen(false)}
                  >
                    <LayoutDashboard size={18} /> Admin
                  </NavLink>
                )}
                {(user?.role === "teacher" || user?.role === "admin") && (
                  <NavLink
                    to="/upload"
                    className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    onClick={() => setOpen(false)}
                  >
                    <Upload size={18} /> Upload
                  </NavLink>
                )}
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <LogOut size={18} /> Sign out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link to="/login" className="btn-secondary" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn-primary" onClick={() => setOpen(false)}>
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
