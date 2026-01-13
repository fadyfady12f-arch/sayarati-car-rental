import api from './api';
import { ApiResponse, User } from '../types';

interface LoginData {
  emailOrPhone: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterData {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  governorate: string;
}

interface LoginResponse {
  user: User;
  accessToken: string;
}

export const authService = {
  async login(data: LoginData): Promise<ApiResponse<LoginResponse>> {
    const response = await api.post('/auth/login', data);
    if (response.data.data?.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
    }
    return response.data;
  },

  async register(data: RegisterData): Promise<ApiResponse<{ id: string; email: string }>> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
  },

  async getProfile(): Promise<ApiResponse<User>> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    const response = await api.put('/auth/me', data);
    return response.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    const response = await api.put('/auth/me/password', { currentPassword, newPassword });
    return response.data;
  },

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token: string, password: string): Promise<ApiResponse<void>> {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },
};
