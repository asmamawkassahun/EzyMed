import axios from "axios";

const API_ORIGIN =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(
    /\/+$/,
    "",
  ) || "https://ezymed.onrender.com";

const clearAuthAndRedirectToLogin = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.assign("/login");
};

const api = axios.create({
  baseURL: `${API_ORIGIN}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      clearAuthAndRedirectToLogin();
    }
    return Promise.reject(error);
  },
);

export default api;
