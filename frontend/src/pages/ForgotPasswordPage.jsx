import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api.js";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email })
      });

      setMessage("Check your email for password reset instructions");
      setEmail("");

      // Redirect to login after 3 seconds
      setTimeout(() => navigate("/login"), 3000);
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
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900">Forgot Password?</h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-700">Email</span>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}
          {message ? <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-600">{message}</p> : null}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPasswordPage;
