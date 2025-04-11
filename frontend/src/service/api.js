import axios from 'axios';
const baseURL = import.meta.env.VITE_BASE_URL

const instance = axios.create({
    baseURL: baseURL,
    headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
    timeout: 5000
})

// Add a request interceptor
instance.interceptors.request.use(
    (config) => {
        // You can add any request modifications here
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized error
            console.error('Unauthorized access');
        }
        return Promise.reject(error);
    }
);

export default instance;