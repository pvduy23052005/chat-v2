import { API } from "./api";

export const friendServiceAPI = {
  sendFriendRequest: async (userId) => {
    const res = await API.post("/friends/requests", { userId });
    return res;
  },
  getFriendRequests: async () => {
    const res = await API.get("/friends/requests");
    return res;
  },
  acceptFriendRequest: async (requestId) => {
    const res = await API.put(`/friends/requests/${requestId}/accept`);
    return res;
  },
  refuseFriendRequest: async (requestId) => {
    const res = await API.put(`/friends/requests/${requestId}/refuse`);
    return res;
  },
  cancelFriendRequest: async (requestId) => {
    const res = await API.delete(`/friends/cancel/${requestId}`);
    return res;
  },
  getFriends: async () => {
    const res = await API.get("/friends");
    return res;
  },
};
