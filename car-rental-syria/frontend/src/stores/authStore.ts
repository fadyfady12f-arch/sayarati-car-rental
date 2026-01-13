import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { authService } from '../services/auth.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (emailOrPhone: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (data: {
    email: string;
    phone: string;
    password: string;
    firstName: string;
    lastName: string;
    governorate: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (emailOrPhone, password, rememberMe) => {
        set({ isLoading: true });
        try {
          const response = await authService.login({ emailOrPhone, password, rememberMe });
          if (response.data) {
            set({
              user: response.data.user,
              isAuthenticated: true,
            });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          await authService.register(data);
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } finally {
          set({ user: null, isAuthenticated: false });
          localStorage.removeItem('accessToken');
        }
      },

      fetchProfile: async () => {
        set({ isLoading: true });
        try {
          const response = await authService.getProfile();
          if (response.data) {
            set({ user: response.data, isAuthenticated: true });
          }
        } catch {
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
