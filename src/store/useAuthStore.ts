import { create } from 'zustand';
import { apiClient, ApiError } from '../services/apiClient';

export interface User {
  _id: string;
  username: string;
  email: string;
  fullName?: string;
  role: string;
  avatar?: {
    url: string;
    localPath?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  statusCode: number;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
  message: string;
  success: boolean;
}

interface ProfileResponse {
  statusCode: number;
  data: User;
  message: string;
  success: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<boolean>;
  updateProfileImage: (imageUri: string) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  clearError: () => set({ error: null }),

  initialize: async () => {
    set({ isLoading: true, error: null });
    try {
      const { accessToken } = await apiClient.getAccessAndRefreshTokens();
      if (!accessToken) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return false;
      }

      
      const response = await apiClient.get<ProfileResponse>('/users/current-user');
      if (response.success && response.data) {
        set({
          user: response.data,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      } else {
        await apiClient.clearTokens();
        set({ user: null, isAuthenticated: false, isLoading: false });
        return false;
      }
    } catch (err: any) {
      
      const { accessToken } = await apiClient.getAccessAndRefreshTokens();
      if (accessToken) {
        
        
        set({
          user: {
            _id: 'offline_user',
            username: 'offline_explorer',
            email: 'offline@lms.com',
            fullName: 'Offline User',
            role: 'USER',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      }

      await apiClient.clearTokens();
      set({ user: null, isAuthenticated: false, isLoading: false });
      return false;
    }
  },

  login: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      
      const payload: any = { password };
      if (username) payload.username = username;
      if (email) payload.email = email;

      const response = await apiClient.post<AuthResponse>('/users/login', payload, { skipAuth: true });
      
      const { user, accessToken, refreshToken } = response.data;
      await apiClient.setTokens(accessToken, refreshToken);

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      
      const isNetworkError =
        err.message?.includes('Network request failed') ||
        err.message?.includes('timed out') ||
        err.message?.includes('Failed to fetch') ||
        err.statusCode === 408;

      if (isNetworkError) {
        console.warn('FreeAPI server offline. Logging in with offline mock credentials.');
        
        
        await apiClient.setTokens('mock_access_token', 'mock_refresh_token');

        set({
          user: {
            _id: 'offline_user',
            username: username || 'offline_explorer',
            email: email || 'offline@lms.com',
            fullName: 'Offline Explorer',
            role: 'USER',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return;
      }

      set({
        isLoading: false,
        error: err.message || 'Login failed. Please check your credentials.',
      });
      throw err;
    }
  },

  register: async (username, email, password, fullName) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.post('/users/register', {
        username,
        email,
        password,
        fullName,
      }, { skipAuth: true });

      set({ isLoading: false });
    } catch (err: any) {
      
      const isNetworkError =
        err.message?.includes('Network request failed') ||
        err.message?.includes('timed out') ||
        err.message?.includes('Failed to fetch') ||
        err.statusCode === 408;

      if (isNetworkError) {
        console.warn('FreeAPI server offline. Simulating successful registration for offline mode.');
        set({ isLoading: false });
        return;
      }

      set({
        isLoading: false,
        error: err.message || 'Registration failed. Try a different username/email.',
      });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      
      await apiClient.post('/users/logout');
    } catch (err) {
      
    } finally {
      await apiClient.clearTokens();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  updateProfileImage: async (imageUri) => {
    set({ error: null });
    try {
      
      const formData = new FormData();
      
      
      const filename = imageUri.split('/').pop() || 'avatar.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      
      formData.append('avatar', {
        uri: imageUri,
        name: filename,
        type,
      } as any);

      try {
        const response = await apiClient.upload<ProfileResponse>('/users/avatar', formData);
        if (response.success && response.data) {
          set({ user: response.data });
          return;
        }
      } catch (uploadErr) {
        
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              avatar: {
                url: imageUri, 
              }
            }
          });
        }
      }
    } catch (err: any) {
      set({ error: err.message || 'Failed to update profile picture.' });
    }
  }
}));
