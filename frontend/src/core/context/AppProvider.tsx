"use client";
import { ReactNode, useEffect } from "react";
import { useAuth } from "@core/hooks/useAuth";
import { useAuthSocket } from "@core/hooks/useAuthSocket";
import { authStore } from "@core/stores/authStore";
import { AppContext } from "./AppContext";
import { UserProfile } from "@core/types";

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const { user, setUser, isLogin } = useAuth();

  useEffect(() => {
    // Import bootstrap JS only on the client side
    require("bootstrap/dist/js/bootstrap.bundle.min");
  }, []);

  // connect socket .
  useAuthSocket(isLogin);

  const login = (dataUser: UserProfile) => {
    authStore.set(dataUser);
    setUser(dataUser);
  };

  const logout = () => {
    authStore.clear();
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ user, setUser, login, logout, isLogin }}>
      {children}
    </AppContext.Provider>
  );
};
