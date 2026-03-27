import { Booking } from "@/types";

export const BOOKING_STATUSES = [
  "Booked",
  "Checked In",
  "Checked Out",
  "Cancelled",
] as const;

export const BOOKING_BADGE_STYLES: Record<Booking["status"], string> = {
  Booked: "bg-booked/10 text-booked border-booked/20 hover:bg-booked/20",
  "Checked In": "bg-checked-in/10 text-checked-in border-checked-in/20 hover:bg-checked-in/20",
  "Checked Out": "bg-checked-out/10 text-checked-out border-checked-out/20 hover:bg-checked-out/20",
  Cancelled: "bg-cancelled/10 text-cancelled border-cancelled/20 hover:bg-cancelled/20",
};

export const BOOKING_LABELS: Record<Booking["status"], string> = {
  Booked: "Booked",
  "Checked In": "Checked In",
  "Checked Out": "Checked Out",
  Cancelled: "Cancelled",
};

export const BOOKING_STATUS_DOTS: Record<string, string> = {
  Booked: "bg-booked",
  "Checked In": "bg-checked-in",
  "Checked Out": "bg-checked-out",
  Cancelled: "bg-cancelled",
};

export const BOOKING_STATUS_SURFACES: Record<string, string> = {
  Booked: "bg-blue-50/50 border-blue-50",
  "Checked In": "bg-purple-50/50 border-purple-50",
  "Checked Out": "bg-slate-50/50 border-slate-50",
  Cancelled: "bg-red-50/50 border-red-50",
};

export const BOOKING_STATUS_TEXT_COLORS: Record<string, string> = {
  Booked: "text-booked",
  "Checked In": "text-checked-in",
  "Checked Out": "text-checked-out",
  Cancelled: "text-cancelled",
};

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
