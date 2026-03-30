import apiClient from './api-client';
import { Booking } from '../types';

export interface CreateBookingInput {
  guestId: number;
  roomId: number;
  checkIn: string;
  checkOut: string;
  status?: Booking["status"];
}

export interface UpdateBookingInput {
  status?: Booking["status"];
  checkIn?: string;
  checkOut?: string;
  guestId?: number;
  roomId?: number;
}

const bookingService = {
  getBookings: async (): Promise<Booking[]> => {
    const response = await apiClient.get('/bookings');
    return response.data;
  },

  getBookingById: async (id: number): Promise<Booking> => {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data;
  },

  createBooking: async (data: CreateBookingInput): Promise<Booking> => {
    const response = await apiClient.post('/bookings', data);
    return response.data;
  },

  updateBooking: async (id: number, data: UpdateBookingInput): Promise<Booking> => {
    const response = await apiClient.put(`/bookings/${id}`, data);
    return response.data;
  },

  deleteBooking: async (id: number): Promise<void> => {
    await apiClient.delete(`/bookings/${id}`);
  },
};

export default bookingService;
