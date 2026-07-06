import { API } from "./api";

export const authServiceAPI = {
  login: async (data: any): Promise<any> => {
    const res = await API.post("/auth/login", data);
    return res;
  },
  logout: async (myID: string): Promise<any> => {
    const res = await API.post("/auth/logout", { myID: myID });
    return res;
  },
  register: async (data: any): Promise<any> => {
    const res = await API.post("/auth/register", data);
    return res;
  },
};
