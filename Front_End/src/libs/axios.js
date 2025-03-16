import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://secondhandmarket.onrender.com/api/",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
});


axiosInstance.interceptors.request.use(
    (config) => {
        
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('jwt='))
            ?.split('=')[1];

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (config.url.startsWith('/')) {
            config.url = config.url.substring(1);
        }

        console.log('Request Config:', {
            url: config.baseURL + config.url,
            headers: config.headers
        });

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 404) {
            console.error('API Endpoint not found:', error.config.url);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;