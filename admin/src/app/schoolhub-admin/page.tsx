import { CalendarDays, MessageCircle } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AttendanceChart, PerformanceChart } from "@/components/admin/Charts";
import { MotionCard } from "@/components/admin/MotionCard";
import { PageHeader } from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { activityFeed, announcements, overviewStats, students } from "@/lib/demo-data";

export default function AdminDashboardPage() {
  return (
    <AdminShell>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Dashboard Home"
          title="Institution overview"
          description="Monitor attendance, academic performance, payments, communications, and daily school operations from one secure admin console."
          action={<button className="admin-button">Generate Report</button>}
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {overviewStats.map((stat, index) => (
            <MotionCard key={stat.label} delay={index * 0.04}>
              <div className="admin-card p-5">
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{stat.label}</p>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <h2 className="text-3xl font-extrabold text-school-navy dark:text-white">{stat.value}</h2>
                  <Badge tone={stat.tone === "gold" ? "amber" : stat.tone === "mint" ? "green" : "blue"}>{stat.delta}</Badge>
                </div>
              </div>
            </MotionCard>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="admin-card p-6">
            <h2 className="text-xl font-extrabold text-school-navy dark:text-white">Attendance Trend</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Monthly present rate across all classes.</p>
            <div className="mt-5"><AttendanceChart /></div>
          </section>
          <section className="admin-card p-6">
            <h2 className="text-xl font-extrabold text-school-navy dark:text-white">Performance Analytics</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Average subject scores from recent exams.</p>
            <div className="mt-5"><PerformanceChart /></div>
          </section>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <section className="admin-card p-6">
            <h2 className="text-lg font-extrabold text-school-navy dark:text-white">Recent Registrations</h2>
            <div className="mt-4 space-y-4">
              {students.map((student) => (
                <div key={student.id} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold">{student.full_name}</p>
                    <p className="text-xs text-slate-500">{student.class_name} • {student.admission_number}</p>
                  </div>
                  <Badge tone="green">New</Badge>
                </div>
              ))}
            </div>
          </section>

          <section className="admin-card p-6">
            <h2 className="text-lg font-extrabold text-school-navy dark:text-white">Announcements</h2>
            <div className="mt-4 space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id}>
                  <p className="font-bold">{announcement.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{announcement.audience}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="admin-card p-6">
            <h2 className="text-lg font-extrabold text-school-navy dark:text-white">Calendar & Activity</h2>
            <div className="mt-4 rounded-3xl bg-school-sky p-4 text-school-navy dark:bg-blue-500/10 dark:text-blue-100">
              <CalendarDays size={22} />
              <p className="mt-3 text-2xl font-extrabold">May 2026</p>
              <p className="text-sm font-semibold">7 upcoming school events</p>
            </div>
            <div className="mt-4 space-y-3">
              {activityFeed.map((item) => (
                <div key={item} className="flex gap-3 text-sm">
                  <MessageCircle className="mt-0.5 text-school-blue" size={16} />
                  <span className="text-slate-600 dark:text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
