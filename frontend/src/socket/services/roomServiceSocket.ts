import { socket } from "../index";

export const roomServiceSocket = {
  removeMember: (roomID: string, memberID: string, fullName: string): void => {
    socket.emit("CLINET_REMOVE_MEMBER", {
      roomID: roomID,
      memberID: memberID,
      fullName: fullName,
    });
  },
  addMembers: (roomID: string, memberIDs: string[], listFullNames: string[]): void => {
    socket.emit("CLINET_ADD_MEMBER", {
      roomID: roomID,
      memberIDs: memberIDs,
      listFullNames: listFullNames,
    });
  },
  leaveRoom: (roomID: string, fullName: string): void => {
    socket.emit("CLINET_MEMBER_LEAVE_ROOM", {
      roomID: roomID,
      fullName: fullName,
    });
  },
  assignAdmin: (roomID: string, fullName: string): void => {
    socket.emit("CLIENT_ASSIGN_ADMIN", {
      roomID: roomID,
      fullName: fullName,
    });
  },
};
