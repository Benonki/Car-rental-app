import { axiosInstance } from './instance.ts';
import Cookies from 'js-cookie';
import type { LoginData  } from '../types.ts';

export const login = (data: LoginData) => {
    return axiosInstance
        .post('auth/login', data)
        .then((resp) => {
            if (resp.data.token) {
                Cookies.set('authToken', resp.data.token, { expires: 1 });
                Cookies.set('refreshToken', resp.data.refreshToken, { expires: 7 });
            }
            return resp.data;
        })
        .catch((err) => {
            throw err;
        });
};

export const register = (data: { email: string; password: string }) => {
    const requestData = {
        email: data.email,
        password: data.password,
        role: "ROLE_USER"
    };

    return axiosInstance
        .post('auth/register', requestData, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((resp) => {
            return resp.data;
        })
        .catch((err) => {
            console.error('Registration error:', err.response?.data);
            throw err;
        });
};


export const logout = () => {
    return axiosInstance
        .post('auth/logout')
        .then(() => {
            Cookies.remove('authToken');
            Cookies.remove('refreshToken');
            return true;
        })
        .catch((err) => {
            console.error('Logout failed:', err);
            return false;
        });
};

export const refreshAuthToken = async () => {
    const refreshToken = Cookies.get('refreshToken');
    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    try {
        const response = await axiosInstance.post('auth/refreshToken', { refreshToken });
        if (response.data.authToken) {
            Cookies.set('authToken', response.data.authToken, { expires: 1 });
            return response.data.authToken;
        }
        throw new Error('Failed to refresh token');
    } catch (err) {
        console.error('Token refresh failed:', err);
        throw err;
    }
};