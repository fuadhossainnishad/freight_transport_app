// src/api/api.ts
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

const api: AxiosInstance = axios.create({
  baseURL: config.baseUrl,
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  async (axiosConfig: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        axiosConfig.headers.set('Authorization', `Bearer ${token}`);
      }
      return axiosConfig;
    } catch (error) {
      console.error('Failed to load token:', error);
      return axiosConfig;
    }
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized — clearing token');
      try {
        await AsyncStorage.removeItem('authToken');
        // Optional: navigate to login screen
      } catch (e) {
        console.error('Failed to clear token:', e);
      }
    }
    if (!error.response) {
      console.error('Network error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = async (token: string | null) => {
  if (token) {
    await AsyncStorage.setItem('authToken', token);
  } else {
    await AsyncStorage.removeItem('authToken');
  }
};

export const clearAuthToken = async () => {
  await AsyncStorage.removeItem('authToken');
};

export default api;