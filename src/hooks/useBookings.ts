import { useState, useEffect, useCallback, useMemo } from "react";
import bookingService, { CreateBookingInput, UpdateBookingInput } from "@/services/booking.service";
import { getRooms, updateRoom } from "@/services/room.service";
import guestService from "@/services/guest.service";
import { Booking, Room, Guest } from "@/types";
import { toast } from "sonner";

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"calendar" | "table">("calendar");
  
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const roomMap = useMemo(() => {
    return rooms.reduce((acc, room) => ({ ...acc, [room.id]: room }), {} as Record<number, Room>);
  }, [rooms]);

  const guestMap = useMemo(() => {
    return guests.reduce((acc, guest) => ({ ...acc, [guest.id]: guest }), {} as Record<number, Guest>);
  }, [guests]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [bookingsData, roomsData, guestsData] = await Promise.all([
        bookingService.getBookings(),
        getRooms(),
        guestService.getGuests(),
      ]);
      setBookings(bookingsData);
      setRooms(roomsData);
      setGuests(guestsData);
    } catch (error) {
      toast.error("Failed to fetch booking data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateBooking = async (data: CreateBookingInput) => {
    try {
      await bookingService.createBooking(data);
      await updateRoom(data.roomId, { status: "Booked" });
      toast.success("Booking created successfully");
      setIsCreateOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to create booking");
    }
  };

  const handleUpdateStatus = async (id: number, status: Booking["status"]) => {
    try {
      await bookingService.updateBooking(id, { status });
      
      const booking = bookings.find(b => b.id === id);
      if (booking) {
        let roomStatus: "Available" | "Booked" = "Booked";
        if (status === "Checked Out" || status === "Cancelled") {
          roomStatus = "Available";
        }
        await updateRoom(booking.roomId, { status: roomStatus });
      }

      toast.success("Status updated");
      if (selectedBooking?.id === id) {
        setSelectedBooking(prev => prev ? { ...prev, status } : null);
      }
      fetchData();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteBooking = async (id: number) => {
    try {
      const booking = bookings.find(b => b.id === id);
      if (booking) {
        await updateRoom(booking.roomId, { status: "Available" });
      }
      
      await bookingService.deleteBooking(id);
      toast.success("Booking cancelled");
      setIsDetailOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to cancel booking");
    }
  };

  const openDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedBooking(null);
  };

  const openCreate = (date?: Date) => {
    setSelectedDate(date || null);
    setIsCreateOpen(true);
  };

  return {
    bookings,
    rooms,
    guests,
    loading,
    view,
    setView,
    selectedBooking,
    isDetailOpen,
    isCreateOpen,
    selectedDate,
    roomMap,
    guestMap,
    openDetail,
    closeDetail,
    openCreate,
    setIsCreateOpen,
    handleCreateBooking,
    handleUpdateStatus,
    handleDeleteBooking,
    refresh: fetchData,
  };
};
