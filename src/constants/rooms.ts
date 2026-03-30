import { Room } from "@/types";

export const ROOM_TYPES = ["Single", "Double", "Deluxe", "Suite"];
export const ROOM_STATUSES: Room["status"][] = ["Available", "Booked", "Maintenance"];

export const ROOM_STATUS_BADGE: Record<Room["status"], string> = {
  Available: "bg-emerald-50 text-emerald-600 border-transparent hover:bg-emerald-100",
  Booked: "bg-blue-50 text-blue-600 border-transparent hover:bg-blue-100",
  Maintenance: "bg-amber-50 text-amber-600 border-transparent hover:bg-amber-100",
};

export const DEFAULT_ROOM_FORM = {
  roomNumber: "",
  roomType: "Single",
  price: 0,
  status: "Available" as Room["status"],
};
