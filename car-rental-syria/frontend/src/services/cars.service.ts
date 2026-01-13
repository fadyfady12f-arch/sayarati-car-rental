import api from './api';
import { ApiResponse, Car, CategoryWithCount, Review, Pagination } from '../types';

interface CarsFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  transmission?: string;
  fuelType?: string;
  minPrice?: number;
  maxPrice?: number;
  seats?: number;
  status?: string;
  branchId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface AvailabilityCheck {
  available: boolean;
  reason?: string;
  nextAvailable?: string;
  days?: number;
  pricePerDay?: number;
  totalPrice?: number;
  deposit?: number;
}

interface SearchAvailableParams {
  pickupDate: string;
  returnDate: string;
  pickupLocation?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export const carsService = {
  async getAll(filters: CarsFilters = {}): Promise<ApiResponse<Car[]> & { pagination: Pagination }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });
    const response = await api.get(`/cars?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<ApiResponse<Car>> {
    const response = await api.get(`/cars/${id}`);
    return response.data;
  },

  async getFeatured(limit: number = 8): Promise<ApiResponse<Car[]>> {
    const response = await api.get(`/cars/featured?limit=${limit}`);
    return response.data;
  },

  async getCategories(): Promise<ApiResponse<CategoryWithCount[]>> {
    const response = await api.get('/cars/categories');
    return response.data;
  },

  async searchAvailable(params: SearchAvailableParams): Promise<ApiResponse<Car[]> & { pagination: Pagination }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const response = await api.get(`/cars/available?${searchParams.toString()}`);
    return response.data;
  },

  async checkAvailability(carId: string, startDate: string, endDate: string): Promise<ApiResponse<AvailabilityCheck>> {
    const response = await api.post(`/cars/${carId}/check-availability`, { startDate, endDate });
    return response.data;
  },

  async getReviews(carId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<Review[]> & { pagination: Pagination }> {
    const response = await api.get(`/cars/${carId}/reviews?page=${page}&limit=${limit}`);
    return response.data;
  },
};
