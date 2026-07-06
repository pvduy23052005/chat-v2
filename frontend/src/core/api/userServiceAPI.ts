import { API } from "./api";

export const userServiceAPI = {
  getUsers: async (): Promise<any> => {
    const res = await API.get("/users");
    return res;
  },

  getFriendRequest: async (): Promise<any> => {
    const res = await API.get("/friends/requests");
    return res;
  },
  
  editProfile: async (data: any): Promise<any> => {
    const res = await API.post("/users/edit/profile", data);
    return res;
  },
};
