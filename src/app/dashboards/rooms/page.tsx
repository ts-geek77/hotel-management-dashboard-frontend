"use client";

import { BedDouble } from "lucide-react";

export default function RoomsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 animate-in fade-in duration-500">
      <div className="p-4 rounded-full" style={{ backgroundColor: "var(--brand-light)", color: "var(--brand)" }}>
        <BedDouble size={48} />
      </div>
      <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Room Management</h1>
      <p className="max-w-md" style={{ color: "var(--text-label)" }}>
        This module is currently under development. Here you will be able to manage room availability, pricing, and status.
      </p>
    </div>
  );
}
