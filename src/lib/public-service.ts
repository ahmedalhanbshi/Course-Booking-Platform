import { AxiosError } from 'axios';
import api from './api-client';

export interface PlatformStats {
  students: number;
  courses: number;
  trainers: number;
  institutes: number;
}

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  _count: {
    courses: number;
  };
}

export interface FeaturedCourse {
  id: string;
  title: string;
  price: string;
  image: string | null;
  category: { id: string; name: string } | null;
  trainer: { id: string; name: string; avatar: string | null } | null;
  staffTrainer: { id: string; name: string } | null;
  institute: { id: string; name: string; logo: string | null } | null;
}

const FALLBACK_STATS: PlatformStats = {
  students: 5000,
  courses: 200,
  trainers: 120,
  institutes: 50,
};

function logPublicFallback(endpoint: string, error: unknown) {
  const axiosError = error as AxiosError | undefined;
  const message = axiosError?.message || 'Unknown API error';
  const status = axiosError?.response?.status;
  const statusText = status ? ` (status: ${status})` : '';

  console.warn(`PublicService fallback for ${endpoint}: ${message}${statusText}`);
}

export const PublicService = {
  // Get platform statistics
  getStats: async (): Promise<PlatformStats> => {
    try {
      const response = await api.get('/api/public/stats');
      return response.data.data;
    } catch (error) {
      logPublicFallback('/api/public/stats', error);
      return FALLBACK_STATS;
    }
  },

  // Get categories with their course counts
  getCategories: async (): Promise<CategoryData[]> => {
    try {
      const response = await api.get('/api/public/categories');
      return response.data.data;
    } catch (error) {
      logPublicFallback('/api/public/categories', error);
      return [];
    }
  },

  // Get featured courses for homepage
  getFeaturedCourses: async (): Promise<FeaturedCourse[]> => {
    try {
      const response = await api.get('/api/public/featured-courses');
      return response.data.data;
    } catch (error) {
      logPublicFallback('/api/public/featured-courses', error);
      return [];
    }
  }
};
