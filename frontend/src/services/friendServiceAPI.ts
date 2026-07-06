import { API } from "./api";

export const friendServiceAPI = {
  sendFriendRequest: async (userId: string): Promise<any> => {
    const res = await API.post("/friends/requests", { userId });
    return res;
  },
  getFriendRequests: async (): Promise<any> => {
    const res = await API.get("/friends/requests");
    return res;
  },
  acceptFriendRequest: async (requestId: string): Promise<any> => {
    const res = await API.put(`/friends/requests/${requestId}/accept`);
    return res;
  },
  refuseFriendRequest: async (requestId: string): Promise<any> => {
    const res = await API.put(`/friends/requests/${requestId}/refuse`);
    return res;
  },
  cancelFriendRequest: async (requestId: string): Promise<any> => {
    const res = await API.delete(`/friends/cancel/${requestId}`);
    return res;
  },
  getFriends: async (): Promise<any> => {
    const res = await API.get("/friends");
    return res;
  },
};
