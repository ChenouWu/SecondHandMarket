import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://secondhandmarket.onrender.com/api",
    withCredentials: true,  // 确保 axios 发送请求时携带 Cookie
    headers: {
        "Content-Type": "application/json",
    }
});

export default axiosInstance;
