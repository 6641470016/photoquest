// frontend/src/services/api.ts
import axios from "axios";

// 🔹 ลบ /api ออก เพราะ backend ใช้เส้นทางตรง เช่น /auth /api/quests ฯลฯ
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// ✅ Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("Sending token:", token);
  return config;
});

// ✅ Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.status, error.response?.data);

    if (error.response?.status === 401) {
      console.warn("Token invalid or expired");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
