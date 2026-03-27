import { useState, useEffect, useCallback } from "react";
import api from "@/services/api-client";
import { Booking, Guest, Room } from "@/types";

export const useDashboard = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [r, g, b] = await Promise.all([
        api("/rooms"),
        api("/guests"),
        api("/bookings"),
      ]);
      setRooms(r.data);
      setGuests(g.data);
      setBookings(b.data);
    } catch (error) {
      console.error("Dashboard data fetch failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const availableRoomsCount = rooms.filter((r) => r.status === "Available").length;
  const activeBookingsCount = bookings.filter(
    (b) => b.status === "Booked" || b.status === "Checked In",
  ).length;

  const recentBookings = [...bookings]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  const guestMap = Object.fromEntries(guests.map((g) => [g.id, g.name]));
  const roomMap = Object.fromEntries(rooms.map((r) => [r.id, r.roomNumber]));

  return {
    rooms,
    guests,
    bookings,
    loading,
    availableRoomsCount,
    activeBookingsCount,
    recentBookings,
    guestMap,
    roomMap,
    refresh: fetchAll,
  };
};
