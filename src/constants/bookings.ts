import { Booking } from "@/types";

export const BOOKING_STATUSES = [
  "Pending",
  "Confirmed",
  "Booked",
  "Checked In",
  "Checked Out",
  "Cancelled",
] as const;

export const BOOKING_BADGE_STYLES: Record<Booking["status"], string> = {
  Booked: "bg-blue-50 text-blue-600 hover:bg-blue-100 border-transparent",
  "Checked In": "bg-purple-50 text-purple-600 hover:bg-purple-100 border-transparent",
  "Checked Out": "bg-slate-100 text-slate-600 hover:bg-slate-200 border-transparent",
  Cancelled: "bg-red-50 text-red-600 hover:bg-red-100 border-transparent",
  Confirmed: "bg-blue-50 text-blue-600 hover:bg-blue-100 border-transparent",
  Pending: "bg-amber-50 text-amber-600 hover:bg-amber-100 border-transparent",
};

export const BOOKING_LABELS: Record<Booking["status"], string> = {
  Booked: "Booked",
  "Checked In": "Checked In",
  "Checked Out": "Checked Out",
  Cancelled: "Cancelled",
  Confirmed: "Confirmed",
  Pending: "Pending",
};
