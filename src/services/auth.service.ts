import { LoginResponse, RegisterResponse, ForgotPasswordResponse } from '../types/auth';
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
  forgotPassword: async (data: any): Promise<ForgotPasswordResponse> => {
    try {
      const response = await apiClient.post<ForgotPasswordResponse>('/auth/forgot-password', data);
      return response.data;
    } catch (error) {
       console.error("Forgot Password Error: ", error);
       throw error;
    }
  },
};

export default authService;
