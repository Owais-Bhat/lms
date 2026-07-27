import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../services/apiClient';
import { notificationService } from '../services/notificationService';

export interface Instructor {
  id: number;
  name: string;
  avatar: string;
  email: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  images: string[];
  price: number;
  rating: number;
  category: string;
  instructor: Instructor;
}

interface ProductsResponse {
  statusCode: number;
  data: {
    data: Array<{
      id: number;
      title: string;
      description: string;
      thumbnail: string;
      images: string[];
      price: number;
      rating: number;
      category: string;
    }>;
  };
  success: boolean;
}

interface UsersResponse {
  statusCode: number;
  data: {
    data: Array<{
      id: number;
      name: {
        first: string;
        last: string;
      };
      picture: {
        large: string;
      };
      email: string;
    }>;
  };
  success: boolean;
}

interface CourseState {
  courses: Course[];
  bookmarks: string[];
  enrolled: string[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  searchQuery: string;
  
  initializeStore: () => Promise<void>;
  fetchCourses: (isRefresh?: boolean) => Promise<void>;
  toggleBookmark: (courseId: string) => Promise<void>;
  enrollInCourse: (courseId: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
}

const COURSES_CACHE_KEY = 'lms_courses_cache';
const BOOKMARKS_KEY = 'lms_bookmarks';
const ENROLLED_KEY = 'lms_enrolled';

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  bookmarks: [],
  enrolled: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
  searchQuery: '',

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  initializeStore: async () => {
    try {
      const [storedBookmarks, storedEnrolled, cachedCourses] = await Promise.all([
        AsyncStorage.getItem(BOOKMARKS_KEY),
        AsyncStorage.getItem(ENROLLED_KEY),
        AsyncStorage.getItem(COURSES_CACHE_KEY),
      ]);

      set({
        bookmarks: storedBookmarks ? JSON.parse(storedBookmarks) : [],
        enrolled: storedEnrolled ? JSON.parse(storedEnrolled) : [],
        courses: cachedCourses ? JSON.parse(cachedCourses) : [],
      });
    } catch (err) {
      console.warn('Failed to load stored lms data', err);
    }
  },

  fetchCourses: async (isRefresh = false) => {
    if (isRefresh) {
      set({ isRefreshing: true, error: null });
    } else {
      set({ isLoading: true, error: null });
    }

    try {
      
      const [productsData, usersData] = await Promise.all([
        apiClient.get<ProductsResponse>('/public/randomproducts?page=1&limit=25'),
        apiClient.get<UsersResponse>('/public/randomusers?page=1&limit=25'),
      ]);

      if (productsData.success && usersData.success) {
        const rawProducts = productsData.data.data;
        const rawUsers = usersData.data.data;

        
        const zippedCourses: Course[] = rawProducts.map((prod, index) => {
          const instructorUser = rawUsers[index % rawUsers.length];
          return {
            id: String(prod.id),
            title: prod.title,
            description: prod.description,
            thumbnail: prod.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500',
            images: prod.images || [],
            price: prod.price,
            rating: prod.rating,
            category: prod.category || 'Technology',
            instructor: {
              id: instructorUser.id,
              name: `${instructorUser.name.first} ${instructorUser.name.last}`,
              avatar: instructorUser.picture.large || 'https://randomuser.me/api/portraits/men/1.jpg',
              email: instructorUser.email,
            },
          };
        });

        
        await AsyncStorage.setItem(COURSES_CACHE_KEY, JSON.stringify(zippedCourses));

        set({
          courses: zippedCourses,
          isLoading: false,
          isRefreshing: false,
        });
      } else {
        throw new Error('Failed to retrieve catalog data from backend');
      }
    } catch (err: any) {
      
      const cached = await AsyncStorage.getItem(COURSES_CACHE_KEY);
      if (cached) {
        set({
          courses: JSON.parse(cached),
          error: 'Offline mode: Loaded cached courses.',
          isLoading: false,
          isRefreshing: false,
        });
      } else {
        set({
          error: err.message || 'Failed to fetch courses. Check connection.',
          isLoading: false,
          isRefreshing: false,
        });
      }
    }
  },

  toggleBookmark: async (courseId: string) => {
    const { bookmarks } = get();
    let updatedBookmarks: string[];

    if (bookmarks.includes(courseId)) {
      updatedBookmarks = bookmarks.filter((id) => id !== courseId);
    } else {
      updatedBookmarks = [...bookmarks, courseId];
      
      
      if (updatedBookmarks.length === 5) {
        setTimeout(async () => {
          await notificationService.showBookmarkMilestone(5);
        }, 100);
      }
    }

    set({ bookmarks: updatedBookmarks });
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updatedBookmarks));
  },

  enrollInCourse: async (courseId: string) => {
    const { enrolled } = get();
    if (enrolled.includes(courseId)) return;

    const updatedEnrolled = [...enrolled, courseId];
    set({ enrolled: updatedEnrolled });
    await AsyncStorage.setItem(ENROLLED_KEY, JSON.stringify(updatedEnrolled));
  },
}));
