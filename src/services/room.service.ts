import apiClient from './api-client';
import { Room } from '../types';

export interface RoomFilters {
  status?: string;
  type?: string;
  search?: string;
}

export interface CreateRoomInput {
  roomNumber: string;
  roomType: string;
  price: number;
  status?: "Available" | "Booked" | "Maintenance";
}

export interface UpdateRoomInput {
  roomNumber?: string;
  roomType?: string;
  status?: "Available" | "Booked" | "Maintenance";
  price?: number;
}

export const getRooms = async (filters?: RoomFilters): Promise<Room[]> => {
  const response = await apiClient.get('/rooms', { params: filters });
  return response.data;
};

export const getRoomById = async (id: number): Promise<Room> => {
  const response = await apiClient.get(`/rooms/${id}`);
  return response.data;
};

export const createRoom = async (data: CreateRoomInput): Promise<Room> => {
  const response = await apiClient.post('/rooms', data);
  return response.data;
};

export const updateRoom = async (id: number, data: UpdateRoomInput): Promise<Room> => {
  const response = await apiClient.put(`/rooms/${id}`, data);
  return response.data;
};

export const deleteRoom = async (id: number): Promise<void> => {
  await apiClient.delete(`/rooms/${id}`);
};
