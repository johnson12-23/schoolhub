import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,#DBEAFE,transparent_34%),linear-gradient(135deg,#F8FBFF,#EEF5FF)] p-4 dark:bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.28),transparent_34%),linear-gradient(135deg,#08111F,#0F172A)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-school-blue via-school-mint to-school-gold" />
      <Suspense fallback={<div className="admin-card h-96 w-full max-w-md animate-pulse" />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
