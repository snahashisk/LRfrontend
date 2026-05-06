"use client";

import { useEffect } from "react";
import axios from "axios";

import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const refreshAuth = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/auth/refresh-token", {
          withCredentials: true,
        });

        console.log(response);

        setAuth({
          user: response.data.data.user,
          accessToken: response.data.data.accessToken,
        });
      } catch (error: any) {
        if (error.response?.status !== 401) {
          toast.error(error.response?.data?.message || "Failed to refresh authentication");
        }
      }
    };

    refreshAuth();
  }, [setAuth]);

  return children;
}
