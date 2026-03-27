import { useState, useEffect, useCallback, useMemo } from "react";
import guestService from "@/services/guest.service";
import { getRooms } from "@/services/room.service";
import { Guest, Booking, Room } from "@/types";
import { toast } from "sonner";

export const useGuests = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [guestHistory, setGuestHistory] = useState<Booking[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const roomMap = useMemo(() => {
    return rooms.reduce((acc, room) => ({ ...acc, [room.id]: room.roomNumber }), {} as Record<number, string>);
  }, [rooms]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [guestsData, roomsData] = await Promise.all([
        guestService.getGuests(),
        getRooms(),
      ]);
      setGuests(guestsData);
      setRooms(roomsData);
    } catch (error) {
      toast.error("Failed to fetch page data");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGuestHistory = async (guestId: number) => {
    setLoadingHistory(true);
    try {
      const allHistory = await guestService.getGuestHistory(guestId);
      // Ensure we only show bookings for this specific guest
      const filteredHistory = allHistory.filter((b: Booking) => b.guestId === guestId);
      setGuestHistory(filteredHistory);
    } catch (error) {
      toast.error("Failed to fetch guest history");
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleViewDetails = async (guest: Guest) => {
    setSelectedGuest(guest);
    setIsDetailOpen(true);
    await fetchGuestHistory(guest.id);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedGuest(null);
    setGuestHistory([]);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    guests,
    loading,
    selectedGuest,
    guestHistory,
    loadingHistory,
    isDetailOpen,
    roomMap,
    handleViewDetails,
    closeDetail,
    refreshGuests: fetchData,
  };
};
