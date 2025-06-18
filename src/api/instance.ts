import axios from 'axios';
import Cookies from 'js-cookie';
import { refreshAuthToken } from './auth';

export const axiosInstance = axios.create({
    baseURL: '/api/',
    timeout: 1000,
});

axiosInstance.interceptors.request.use((config) => {
    const token = Cookies.get('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newToken = await refreshAuthToken();
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