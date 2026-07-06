import { useState } from "react";
import { authStore } from "@core/stores/authStore";
import { UserProfile } from "@core/types";

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(() => authStore.getUser());

  return {
    user,
    setUser,
    isLogin: user !== null,
  };
};
