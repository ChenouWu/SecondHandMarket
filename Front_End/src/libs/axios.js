import axios from "axios";

 const axiosInstance = axios.create({
    baseURL: "http://localhost:5001/api",
    withCredentials: true,
    headers: {
        "Content-type": "application/json"
    }
});

export default axiosInstance;
