import apiClient from "./api-client";
import { Guest, Booking } from "@/types";

export interface GuestWithHistory extends Guest {
  bookings: Booking[];
}

const guestService = {
  getGuests: async () => {
    const response = await apiClient.get<Guest[]>("/guests");
    return response.data;
  },

  getGuestById: async (id: number) => {
    const response = await apiClient.get<Guest>(`/guests/${id}`);
    return response.data;
  },

  getGuestHistory: async (id: number) => {
    const response = await apiClient.get<Booking[]>(`/bookings?guestId=${id}`);
    return response.data;
  },

  createGuest: async (data: Omit<Guest, "id">) => {
    const response = await apiClient.post<Guest>("/guests", data);
    return response.data;
  },
};

export default guestService;
