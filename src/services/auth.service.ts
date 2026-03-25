import { LoginResponse, RegisterResponse } from '../types/auth';
import apiClient from './api-client';

const authService = {
  login: async (credentials: any): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
      return response.data;
    } catch (error) {
       console.error("Login Error: ", error);
       throw error;
    }
  },
  register: async (data: any): Promise<RegisterResponse> => {
    try {
      const response = await apiClient.post<RegisterResponse>('/auth/register', data);
      return response.data;
    } catch (error) {
       console.error("Register Error: ", error);
       throw error;
    }
  },
};

export default authService;
