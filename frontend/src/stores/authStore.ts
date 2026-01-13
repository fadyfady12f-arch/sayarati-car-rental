import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Mock login - replace with actual API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Mock user data
          const mockUser: User = {
            id: '1',
            email,
            firstName: 'أحمد',
            lastName: 'محمد',
            phone: '+963 912 345 678',
            role: email.includes('admin') ? 'ADMIN' : 'USER',
          };

          set({
            user: mockUser,
            token: 'mock-jwt-token',
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (error) {
          set({
            error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
            isLoading: false,
          });
          return false;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          // Mock register - replace with actual API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const mockUser: User = {
            id: '1',
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            role: 'USER',
          };

          set({
            user: mockUser,
            token: 'mock-jwt-token',
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (error) {
          set({
            error: 'حدث خطأ أثناء إنشاء الحساب',
            isLoading: false,
          });
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
