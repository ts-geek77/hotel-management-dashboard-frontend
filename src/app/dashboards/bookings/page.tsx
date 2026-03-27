"use client";

import { CalendarCheck } from "lucide-react";

export default function BookingsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 animate-in fade-in duration-500">
      <div className="p-4 rounded-full" style={{ backgroundColor: "var(--brand-light)", color: "var(--brand)" }}>
        <CalendarCheck size={48} />
      </div>
      <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Booking Management</h1>
      <p className="max-w-md" style={{ color: "var(--text-label)" }}>
        This module is currently under development. Here you will be able to manage reservations, check-ins, and check-outs.
      </p>
    </div>
  );
}
