import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:5189",
    headers: {
        "Content-Type": "application/json",
    },
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error("Unauthorized - Invalid or Expired Token");
            localStorage.removeItem("token");
        }
        return Promise.reject(error);
    }
);

export default instance;
