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

      // Fetch the current user to verify session is active
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
      // In case of offline, restore credentials silently if tokens exist
      const { accessToken } = await apiClient.getAccessAndRefreshTokens();
      if (accessToken) {
        // If offline and can't fetch, we bypass backend verification but allow offline access
        // We set a mock offline user to let user browse cached courses
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
      // FreeAPI supports logging in using username OR email, alongside password.
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
      // Call logout endpoint to clear session on backend
      await apiClient.post('/users/logout');
    } catch (err) {
      // Squelch background api logout error
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
      // Prepare form data for file upload
      const formData = new FormData();
      
      // Determine file extension and type
      const filename = imageUri.split('/').pop() || 'avatar.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      // React Native FormData append handles files by passing an object structure:
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
        // Fallback to local avatar update if API fails or doesn't support PATCH avatar
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              avatar: {
                url: imageUri, // Local path fallback
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
