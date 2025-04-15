import { store } from "../lib/store";
import axios from "axios";

const mainUrl = process.env.NEXT_PUBLIC_BASE_URL;

const request = axios.create({
  baseURL: mainUrl,
  withCredentials: true,
});

console.log({ mainUrl });

request.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token =
      state.user?.token ||
      (typeof window !== "undefined" ? localStorage.getItem("token") : null);

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // You might want to dispatch a logout action here
    }
    return Promise.reject(error);
  }
);

export default request;
