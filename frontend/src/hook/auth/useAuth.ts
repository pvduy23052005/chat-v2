import { useState } from "react";
import { authStore } from "../../stores/authStore";
import { UserProfile } from "../../types";

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(() => authStore.getUser());

  return {
    user,
    setUser,
    isLogin: user !== null,
  };
};
