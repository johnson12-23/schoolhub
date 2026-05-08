"use client";

import { attendanceChart, performanceChart } from "@/lib/demo-data";

export function AttendanceChart() {
  const points = attendanceChart
    .map((item, index) => {
      const x = (index / (attendanceChart.length - 1)) * 100;
      const y = 100 - item.present;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="h-64 rounded-3xl bg-gradient-to-br from-blue-50 to-white p-4 dark:from-blue-500/10 dark:to-slate-950">
      <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
        <polyline points={points} fill="none" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {attendanceChart.map((item, index) => {
          const x = (index / (attendanceChart.length - 1)) * 100;
          const y = 100 - item.present;
          return <circle key={item.month} cx={x} cy={y} r="2.2" fill="#2563EB" />;
        })}
      </svg>
      <div className="-mt-6 flex justify-between text-xs font-bold text-slate-500">
        {attendanceChart.map((item) => <span key={item.month}>{item.month}</span>)}
      </div>
    </div>
  );
}

export function PerformanceChart() {
  return (
    <div className="flex h-64 items-end gap-3 rounded-3xl bg-gradient-to-br from-emerald-50 to-white p-4 dark:from-emerald-500/10 dark:to-slate-950">
      {performanceChart.map((item) => (
        <div key={item.subject} className="flex h-full flex-1 flex-col justify-end gap-2">
          <div
            className="rounded-t-2xl bg-school-mint shadow-lg shadow-emerald-500/15"
            style={{ height: `${item.score}%` }}
            title={`${item.subject}: ${item.score}%`}
          />
          <span className="text-center text-xs font-bold text-slate-500">{item.subject}</span>
        </div>
      ))}
    </div>
  );
}
