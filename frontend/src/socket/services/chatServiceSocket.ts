import { socket } from "../index";

export const chatServiceSocket = {
  sendMessage: (data: any): void => {
    if (!socket.connected) return;
    socket.emit("CLIENT_SEND_MESSAGE", data);
  },

  sendTyping: (data: any): void => {
    if (!socket.connected) return;
    socket.emit("CLIENT_SEND_TYPING", data);
  },

  userReadLastMessage: (data: { roomID: string; userID: string }): void => {
    if (!socket.connected) return;
    socket.emit("CLIENT_READ_ROOM", data);
  },
};
