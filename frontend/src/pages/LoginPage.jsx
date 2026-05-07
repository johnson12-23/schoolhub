import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-shell py-12">
      <div className="mx-auto max-w-md card-surface p-8">
        <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-brand-green">Welcome back</p>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900">Login to SchoolHub</h1>
        <p className="mt-2 text-sm text-slate-600">
          Sign in to open your learning space and access books, slides, and past questions.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-700">Email</span>
            <input
              type="email"
              className="input-field"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-700">Password</span>
            <input
              type="password"
              className="input-field"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="Enter your password"
              required
            />
          </label>

          {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}

          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 rounded-2xl bg-brand-cream p-4 text-sm text-slate-600">
          <p className="font-bold text-slate-800">Demo accounts</p>
          <p className="mt-1">Student: student@schoolhub.gh / password123</p>
          <p>Teacher: teacher@schoolhub.gh / password123</p>
          <p>Admin: admin@schoolhub.gh / password123</p>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          New here?{" "}
          <Link to="/register" className="font-bold text-brand-green">
            Join Now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
