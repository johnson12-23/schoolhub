import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = searchParams.get("token");

  if (!token) {
    return (
      <div className="container-shell py-12">
        <div className="mx-auto max-w-md card-surface p-8">
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
            Invalid or missing reset token. Please request a new password reset link.
          </p>
          <p className="mt-6 text-center text-sm text-slate-500">
            <Link to="/forgot-password" className="font-bold text-brand-green">
              Request New Link
            </Link>
          </p>
        </div>
      </div>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-shell py-12">
      <div className="mx-auto max-w-md card-surface p-8">
        <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-brand-green">Reset Password</p>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900">Create New Password</h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter your new password below to regain access to your account.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-700">New Password</span>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter new password"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-700">Confirm Password</span>
            <input
              type="password"
              className="input-field"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm new password"
              required
            />
          </label>

          {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}
          {message ? <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-600">{message}</p> : null}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Remember your password?{" "}
          <Link to="/login" className="font-bold text-brand-green">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
