import axios from 'axios';
import Cookies from 'js-cookie';
import { refreshAuthToken } from './auth';

export const axiosInstance = axios.create({
    baseURL: '/api/',
    timeout: 5000,
    withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
    const token = Cookies.get('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;
                refreshPromise = refreshAuthToken().finally(() => {
                    isRefreshing = false;
                });
            }

            try {
                const newToken = await refreshPromise!;
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('Unable to refresh token:', refreshError);
                Cookies.remove('authToken');
                Cookies.remove('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);