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
  getProfile: async (): Promise<LoginResponse['user']> => {
    try {
      const response = await apiClient.get<any>('/auth/profile');
      const data = response.data;
      return data.user || data.data?.user || data;
    } catch (error) {
      console.error("Get Profile Error: ", error);
      throw error;
    }
  },
  updateProfile: async (data: any): Promise<any> => {
    try {
      const response = await apiClient.put('/auth/profile', data);
      return response.data;
    } catch (error) {
      console.error("Update Profile Error: ", error);
      throw error;
    }
  },
  uploadImage: async (formData: FormData): Promise<any> => {
    try {
      const response = await apiClient.post('/auth/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Upload Image Error: ", error);
      throw error;
    }
  },
  changePassword: async (data: any): Promise<any> => {
    try {
      const response = await apiClient.put('/auth/change-password', data);
      return response.data;
    } catch (error) {
      console.error("Change Password Error: ", error);
      throw error;
    }
  },
};

export default authService;
