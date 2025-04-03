import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/',
    timeout: 1000,
})

axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem('refreshToken')
    config.headers.Authorization = token

    return config
})