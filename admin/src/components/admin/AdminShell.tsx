"use client";

import { Bell, Menu, Search } from "lucide-react";
import { useState } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { ThemeToggle } from "@/components/admin/ThemeToggle";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 lg:flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur dark:border-white/10 dark:bg-slate-950/85">
          <div className="flex items-center gap-3 px-4 py-4 lg:px-8">
            <button
              type="button"
              className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={18} />
            </button>
            <label className="relative hidden flex-1 md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input className="admin-input pl-11" placeholder="Search students, payments, classes..." />
            </label>
            <button className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200">
              <Bell size={18} />
            </button>
            <ThemeToggle />
            <div className="hidden text-right sm:block">
              <p className="text-sm font-extrabold">Super Admin</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">admin@schoolhub.edu</p>
            </div>
          </div>
        </header>
        <div className="px-4 py-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
