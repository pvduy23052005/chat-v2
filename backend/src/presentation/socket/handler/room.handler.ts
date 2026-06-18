import { Server, Socket } from "socket.io";

import { NotifyRemoveMemberUseCase } from "../../../application/use-cases/room/notifications/notify-remove-member.use-case";
import { NotifyAddMemberUseCase } from "../../../application/use-cases/room/notifications/notify-add-member.use-case";
import { NotifyLeaveRoomUseCase } from "../../../application/use-cases/room/notifications/notify-leave-room.use-case";
import { NotifyAssignAdminUseCase } from "../../../application/use-cases/room/notifications/notify-assign-admin.use-case";

import { RoomWriteRepository } from "../../../infrastructure/database/repositories/room.repository";
import { ChatWriteRepository } from "../../../infrastructure/database/repositories/chat.repository";
import { UserReadRepository, } from "../../../infrastructure/database/repositories/user.repository";

const roomWriteRepo = new RoomWriteRepository();
const chatWriteRepo = new ChatWriteRepository();
const userReadRepo = new UserReadRepository();

export const roomSocket = async (io: Server, socket: Socket) => {
  const myID = socket.data.user.userId;

  socket.on("CLINET_REMOVE_MEMBER", async (data) => {
    try {
      const { roomID, fullName } = data;
      socket.join(roomID);

      const notifyRemoveMemberUseCase = new NotifyRemoveMemberUseCase(roomWriteRepo, chatWriteRepo, userReadRepo);
      const newChat = await notifyRemoveMemberUseCase.execute(roomID, myID, fullName);

      io.to(roomID).emit("SERVER_RETURN_MESSAGE", newChat);
    } catch (error) {
      console.error("Lỗi Socket Remove Member:", error);
    }
  });

  socket.on("CLINET_ADD_MEMBER", async (data) => {
    try {
      const { roomID, listFullNames } = data;
      socket.join(roomID);

      const notifyAddMemberUseCase = new NotifyAddMemberUseCase(roomWriteRepo, chatWriteRepo, userReadRepo);
      const newChat = await notifyAddMemberUseCase.execute(roomID, myID, listFullNames);

      io.to(roomID).emit("SERVER_RETURN_MESSAGE", newChat);
    } catch (error) {
      console.error("Lỗi Socket Add Member:", error);
    }
  });

  socket.on("CLINET_MEMBER_LEAVE_ROOM", async (data) => {
    try {
      const { roomID, fullName } = data;
      socket.join(roomID);

      const notifyLeaveRoomUseCase = new NotifyLeaveRoomUseCase(roomWriteRepo, chatWriteRepo);
      const newChat = await notifyLeaveRoomUseCase.execute(roomID, fullName);

      io.to(roomID).emit("SERVER_RETURN_MESSAGE", newChat);
    } catch (error) {
      console.error("Lỗi Socket Leave Room:", error);
    }
  });

  socket.on("CLIENT_ASSIGN_ADMIN", async (data) => {
    try {
      const { roomID, fullName } = data;
      socket.join(roomID);

      const notifyAssignAdminUseCase = new NotifyAssignAdminUseCase(roomWriteRepo, chatWriteRepo, userReadRepo);
      const newChat = await notifyAssignAdminUseCase.execute(roomID, myID, fullName);

      io.to(roomID).emit("SERVER_RETURN_MESSAGE", newChat);
    } catch (error) {
      console.log("Lỗi Socket Assign Admin:", error);
    }
  });
};
