export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role?: string;
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface ForgotPasswordResponse {
  message: string;
}
