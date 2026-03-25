"use client";

import { BedDouble } from "lucide-react";

export default function RoomsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 animate-in fade-in duration-500">
      <div className="p-4 bg-teal-50 text-teal-600 rounded-full">
        <BedDouble size={48} />
      </div>
      <h1 className="text-2xl font-bold text-zinc-900">Room Management</h1>
      <p className="text-zinc-500 max-w-md">
        This module is currently under development. Here you will be able to manage room availability, pricing, and status.
      </p>
    </div>
  );
}
