import { API } from "./api";

export const roomServiceAPI = {
  getDetail: async (roomID: string): Promise<any> => {
    const res = await API.get(`/room/detail/${roomID}`);
    return res;
  },
  edit: async (roomID: string, title: string): Promise<any> => {
    const res = await API.patch(`/room/edit/${roomID}`, {
      title: title,
    });
    return res;
  },
  create: async (data: any): Promise<any> => {
    const res = await API.post("/room/create", data);
    return res;
  },
  delete: async (roomID: string): Promise<any> => {
    const res = await API.post(`/room/delete/${roomID}`);
    return res;
  },
  removeMember: async (roomID: string, memberID: string): Promise<any> => {
    const res = await API.post(`/room/remove-member/${roomID}`, {
      removeMemberID: memberID,
    });
    return res;
  },
  addMember: async (roomID: string, memberID: string | string[]): Promise<any> => {
    const res = await API.post(`/room/add-member/${roomID}`, {
      newMemberIDs: memberID,
    });
    return res;
  },
  leaveRoom: async (roomID: string): Promise<any> => {
    const res = await API.post(`/room/leave/${roomID}`);
    return res;
  },
  assignAdmin: async (roomID: string, memberID: string): Promise<any> => {
    const res = await API.post(`/room/assign-admin/${roomID}`, {
      newAdminID: memberID,
    });
    return res;
  },
};
