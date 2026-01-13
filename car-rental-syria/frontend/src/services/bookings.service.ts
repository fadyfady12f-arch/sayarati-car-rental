import api from './api';
import { ApiResponse, Booking, Pagination } from '../types';

interface CreateBookingData {
  carId: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  returnLocation: string;
  pickupBranchId?: string;
  returnBranchId?: string;
  extras?: string[];
  couponCode?: string;
  customerNotes?: string;
  driverName?: string;
  driverLicense?: string;
  driverPhone?: string;
}

export const bookingsService = {
  async create(data: CreateBookingData): Promise<ApiResponse<Booking>> {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  async getById(id: string): Promise<ApiResponse<Booking>> {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  async getMyBookings(
    status?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<Booking[]> & { pagination: Pagination }> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('page', String(page));
    params.append('limit', String(limit));

    const response = await api.get(`/bookings/my-bookings?${params.toString()}`);
    return response.data;
  },

  async cancel(id: string, reason?: string): Promise<ApiResponse<Booking>> {
    const response = await api.post(`/bookings/${id}/cancel`, { reason });
    return response.data;
  },

  // Admin methods
  async getAll(
    filters: {
      status?: string;
      paymentStatus?: string;
      search?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<ApiResponse<Booking[]> & { pagination: Pagination }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });
    const response = await api.get(`/bookings?${params.toString()}`);
    return response.data;
  },

  async confirm(id: string): Promise<ApiResponse<Booking>> {
    const response = await api.post(`/bookings/${id}/confirm`);
    return response.data;
  },

  async reject(id: string, reason?: string): Promise<ApiResponse<Booking>> {
    const response = await api.post(`/bookings/${id}/reject`, { reason });
    return response.data;
  },

  async activate(id: string, vehicleData: {
    mileage: number;
    fuel: number;
    condition?: string;
    photos?: string[];
  }): Promise<ApiResponse<Booking>> {
    const response = await api.post(`/bookings/${id}/activate`, { type: 'pickup', ...vehicleData });
    return response.data;
  },

  async complete(id: string, vehicleData: {
    mileage: number;
    fuel: number;
    condition?: string;
    photos?: string[];
  }): Promise<ApiResponse<Booking>> {
    const response = await api.post(`/bookings/${id}/complete`, { type: 'return', ...vehicleData });
    return response.data;
  },
};
