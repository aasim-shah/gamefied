"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { setCredentials, logout } from "@/lib/store/slices/userSlice";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const response = await axiosInstance.get("/auth/me");
            const user = response.data;
            if (user) {
              // Set credentials in Redux store
              store.dispatch(setCredentials({ token, userInfo: user }));
            } else {
              // If we couldn't get the user info, clear the token and logout
              localStorage.removeItem("token");
              store.dispatch(logout());
            }
          } catch (error) {
            console.error("Auth check error:", error);
            // If there was an error, clear the token and logout
            localStorage.removeItem("token");
            store.dispatch(logout());
          }
        } else {
          // If no token exists, ensure we're logged out
          store.dispatch(logout());
        }
      } finally {
        setIsInitialized(true);
      }
    };

    // Check auth on mount
    checkAuth();

    // Set up a listener for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </Provider>
  );
}
