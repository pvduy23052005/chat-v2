import { ReactNode } from "react";
import { useAuth } from "../hook/auth/useAuth";
import { useAuthSocket } from "../hook/socket/useAuthSocket";
import { authStore } from "../stores/authStore";
import { AppContext } from "./AppContext";
import { UserProfile } from "../types";

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const { user, setUser, isLogin } = useAuth();

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
