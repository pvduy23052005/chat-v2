import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 60000,
});

API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

API.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    const { response } = error;

    if (response) {
      if (response.status === 401) {
        if (window.location.pathname !== "/auth/login") {
          window.location.href = "/auth/login";
        }
      }
      if (response.status === 403) {
        console.error("Bạn không có quyền thực hiện hành động này.");
      }
    }
    return Promise.reject(error);
  },
);
