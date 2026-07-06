import { API } from "./api";

export const chatServiceAPI = {
  getRoomAcceptes: async (): Promise<any> => {
    const res = await API.get("/chat/rooms?status=accepted");
    return res;
  },
  getRoomWaitings: async (): Promise<any> => {
    const res = await API.get("/chat/rooms?status=waiting");
    return res;
  },
  getChats: async (roomID: string, cursor: string = ""): Promise<any> => {
    const res = await API.get(`/chat/room/${roomID}?cursor=${cursor}`);
    return res;
  },
};
