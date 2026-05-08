"use client";

import {
  Bell,
  BookOpen,
  CalendarCheck,
  CreditCard,
  GraduationCap,
  Home,
  LayoutDashboard,
  MessageSquare,
  ScrollText,
  Settings,
  Shield,
  Users
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/schoolhub-admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/schoolhub-admin/students", label: "Students", icon: GraduationCap },
  { href: "/schoolhub-admin/teachers", label: "Teachers", icon: Users },
  { href: "/schoolhub-admin/classes", label: "Classes & Subjects", icon: BookOpen },
  { href: "/schoolhub-admin/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/schoolhub-admin/results", label: "Results", icon: ScrollText },
  { href: "/schoolhub-admin/payments", label: "Fees & Payments", icon: CreditCard },
  { href: "/schoolhub-admin/announcements", label: "Announcements", icon: Bell },
  { href: "/schoolhub-admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/schoolhub-admin/users", label: "Admin Roles", icon: Shield },
  { href: "/schoolhub-admin/settings", label: "Settings", icon: Settings }
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn("fixed inset-0 z-40 bg-slate-950/40 lg:hidden", open ? "block" : "hidden")}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-76 max-w-[82vw] border-r border-slate-200 bg-white p-4 transition-transform dark:border-white/10 dark:bg-slate-950 lg:static lg:block lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Link href="/schoolhub-admin" className="flex items-center gap-3 rounded-3xl bg-school-sky p-4 dark:bg-blue-500/10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-school-blue text-white">
            <Home size={22} />
          </div>
          <div>
            <p className="text-lg font-extrabold text-school-navy dark:text-white">SchoolHub</p>
            <p className="text-xs font-bold uppercase tracking-wide text-school-blue">Admin Console</p>
          </div>
        </Link>

        <nav className="mt-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition",
                  active
                    ? "bg-school-blue text-white shadow-lg shadow-blue-500/20"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
