import { LoginResponse } from '../types/auth';
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
};

export default authService;
