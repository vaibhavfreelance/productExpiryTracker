// src/axios.js
import axios from "axios";

// ✅ Axios instance with environment base URL
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ✅ From .env file change
  // withCredentials: false, // Set true only if you use cookies-based auth
});

// ✅ Request interceptor to attach token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// ✅ Response interceptor to catch errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        "❌ Response error:",
        error.response.status,
        error.response.data
      );
    } else {
      console.error("❌ Network error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default instance;
