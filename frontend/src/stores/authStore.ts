import { UserProfile } from "../types";

export const authStore = {
  getUser: (): UserProfile | null => {
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
    localStorage.setItem("user", JSON.stringify(dataUser));
  },
  clear: (): void => {
    localStorage.removeItem("user");
  }
};
