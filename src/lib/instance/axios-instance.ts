// axios-instance.ts

import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // 1) If verify-otp gives custom token → use that instead
      if (config.headers?._customToken) {
        config.headers.Authorization = `Bearer ${config.headers._customToken}`;
        delete config.headers._customToken;
        return config;
      }

      // 2) Otherwise use NextAuth session token
      const session = await getSession();
      if (session && "accessToken" in session && config.headers) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    } catch (error) {
      console.error("Failed to get session:", error);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
