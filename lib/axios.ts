import axios from "axios";
import { store } from "./store";
import { logout } from "./store/slices/userSlice";
import { toast } from "@/components/ui/use-toast";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from Redux store first, fallback to localStorage
    const state = store.getState();
    const token = state.user?.token || localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors
    if (error.message === "Network Error") {
      toast({
        variant: "destructive",
        title: "Network Error",
        description:
          "Unable to connect to the server. Please check your internet connection.",
      });
    }

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear token and user data
      localStorage.removeItem("token");
      store.dispatch(logout());

      // Only redirect if we're not already on the login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
