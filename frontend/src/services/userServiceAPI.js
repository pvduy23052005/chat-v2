import { API } from "./api";

export const userServiceAPI = {
  getUsers: async () => {
    const res = await API.get("/users");
    return res;
  },

  getFriendRequest : async () => {
    const res = await API.get("/friends/requests");
    return res;
  },
  
  editProfile: async (data) => {
    const res = await API.post("/users/edit/profile", data);
    return res;
  },
};
