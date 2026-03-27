import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Room } from "@/types";
import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  CreateRoomInput,
  UpdateRoomInput,
} from "@/services/room.service";
import { DEFAULT_ROOM_FORM } from "@/constants/rooms";

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getRooms();
      setRooms(data);
    } catch {
      toast.error("Failed to load rooms.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleAddRoom = async (form: CreateRoomInput) => {
    if (!form.roomNumber || !form.roomType || !form.price) {
      toast.error("Please fill in all fields.");
      return false;
    }
    try {
      setSaving(true);
      await createRoom({ ...form, price: Number(form.price) });
      toast.success("Room added successfully!");
      fetchRooms();
      return true;
    } catch {
      toast.error("Failed to add room.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateRoom = async (id: number, form: UpdateRoomInput) => {
    try {
      setSaving(true);
      await updateRoom(id, { ...form, price: Number(form.price) });
      toast.success("Room updated successfully!");
      fetchRooms();
      return true;
    } catch {
      toast.error("Failed to update room.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRoom = async (id: number) => {
    try {
      setSaving(true);
      await deleteRoom(id);
      toast.success("Room deleted.");
      fetchRooms();
      return true;
    } catch {
      toast.error("Failed to delete room.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    rooms,
    loading,
    saving,
    fetchRooms,
    handleAddRoom,
    handleUpdateRoom,
    handleDeleteRoom,
  };
};
