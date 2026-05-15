"use client";

import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(searchParams.get("error") === "unauthorized" ? "Only authorized admins can access this console." : "");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.replace(searchParams.get("next") || "/schoolhub-admin");
  }

  async function handleForgotPassword() {
    if (!email) {
      setError("Enter your admin email before requesting a reset link.");
      return;
    }

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/schoolhub-admin/login`
    });

    setError(resetError ? resetError.message : "Password reset link sent to your email.");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45 }}
      className="admin-card w-full max-w-md p-8"
    >
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-school-blue text-2xl font-extrabold text-white shadow-lg shadow-blue-500/30">
          SH
        </div>
        <h1 className="mt-5 text-3xl font-extrabold text-school-navy dark:text-white">SchoolHub Admin</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Secure school administration console</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Email address</span>
          <span className="relative block">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="admin-input pl-11"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@schoolhub.edu"
              required
            />
          </span>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Password</span>
          <span className="relative block">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="admin-input pl-11"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              required
            />
          </span>
        </label>

        {error ? (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:bg-red-500/15 dark:text-red-200">
            {error}
          </div>
        ) : null}

        <button type="submit" className="admin-button w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in securely"}
        </button>
        <button type="button" onClick={handleForgotPassword} className="w-full text-sm font-bold text-school-blue">
          Forgot Password
        </button>
      </form>
    </motion.div>
  );
}
