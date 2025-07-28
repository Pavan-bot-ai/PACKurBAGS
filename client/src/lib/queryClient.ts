import { QueryClient } from '@tanstack/react-query';

const BASE_URL = import.meta.env.DEV ? '' : '';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('travelApp_token');
};

// API request function with authentication
export const apiRequest = async (
  method: string,
  url: string,
  data?: any,
  options: RequestInit = {}
) => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (data && (method !== 'GET')) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${BASE_URL}${url}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`${response.status}: ${errorData.error || response.statusText}`);
    }

    // Handle empty responses
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server');
    }
    throw error;
  }
};

// Default query function for react-query
const defaultQueryFn = async ({ queryKey }: { queryKey: any[] }) => {
  const [url] = queryKey;
  return apiRequest('GET', url);
};

// Create query client with default configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (previously cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry on 401 Unauthorized or network errors
        if (error?.message?.includes('401:') || error?.message?.includes('Network error')) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
      onError: (error) => {
        console.warn('Mutation error caught:', error);
      },
    },
  },
});

// Auth utilities
export const setAuthToken = (token: string) => {
  localStorage.setItem('travelApp_token', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('travelApp_token');
};

export const isAuthError = (error: any): boolean => {
  return error?.message?.includes('401:');
};