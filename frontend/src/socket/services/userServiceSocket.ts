import { socket } from "../index";

export const userServiceSocket = {
  chatNotFriend: (userID: string): void => {
    if (!socket.connected) return;
    socket.emit("CLIENT_SEND_CHAT", {
      userID: userID,
    });
  },
  
  friendRequest: (userID: string): void => {
    if (!socket.connected) return;
    socket.emit("CIENT_FRIEND_REQUEST", {
      userID: userID,
    });
  },

  cancelRequest: (userID: string): void => {
    if (!socket.connected) return;
    socket.emit("CLIENT_FRIEND_CANCEL", {
      userID: userID,
    });
  },

  refuseFriend: (userID: string): void => {
    if (!socket.connected) return;
    socket.emit("CLIENT_REFUSE_FRIEND", {
      userID: userID,
    });
  },

  acceptFriend: (userID: string): void => {
    if (!socket.connected) return;
    socket.emit("CLIENT_ACCEPT_FRIEND", {
      userID: userID,
    });
  },
};
