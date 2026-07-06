import { UserProfile } from "@core/types";

const isClient = typeof window !== "undefined";

export const authStore = {
  getUser: (): UserProfile | null => {
    if (!isClient) return null;
    const user = localStorage.getItem("user");

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user) as UserProfile;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  set: (dataUser: UserProfile): void => {
    if (!isClient) return;
    localStorage.setItem("user", JSON.stringify(dataUser));
  },
  clear: (): void => {
    if (!isClient) return;
    localStorage.removeItem("user");
  },
};
