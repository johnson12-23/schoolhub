"use client";

import { Bell, CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  created_at: string;
};

const fallbackNotifications: NotificationItem[] = [
  {
    id: "local-1",
    title: "Attendance review",
    body: "JHS 3 Green has two late arrivals today.",
    created_at: new Date().toISOString()
  },
  {
    id: "local-2",
    title: "Payment alert",
    body: "Three Paystack records need reconciliation.",
    created_at: new Date().toISOString()
  }
];

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>(fallbackNotifications);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("admin-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const record = payload.new as { id: string; subject?: string; body?: string; created_at?: string };
          setItems((current) => [
            {
              id: record.id,
              title: record.subject || "New message",
              body: record.body || "A new contact message arrived.",
              created_at: record.created_at || new Date().toISOString()
            },
            ...current
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200"
        aria-label="Open notifications"
      >
        <Bell size={18} />
        {items.length ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-school-blue px-1 text-[10px] font-extrabold text-white">
            {items.length}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-14 z-50 w-80 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-white/10">
            <p className="text-sm font-extrabold text-school-navy dark:text-white">Realtime notifications</p>
            <button
              type="button"
              onClick={() => setItems([])}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Mark all as read"
            >
              <CheckCheck size={16} />
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            {items.length ? (
              items.map((item) => (
                <div key={item.id} className="rounded-2xl p-3 transition hover:bg-slate-50 dark:hover:bg-slate-800">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.body}</p>
                </div>
              ))
            ) : (
              <p className="p-5 text-center text-sm text-slate-500">No unread notifications.</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
