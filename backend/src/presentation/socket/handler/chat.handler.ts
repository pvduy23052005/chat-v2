import { Server, Socket } from "socket.io";
import { SendMessageUseCase, SendMessageOutputDto } from "../../../application/use-cases/chat/send-message.use-case";
import { ReadRoomUseCase } from "../../../application/use-cases/chat/read-room.use-case";

import { RoomReadRepository, RoomWriteRepository } from "../../../infrastructure/database/repositories/room.repository";
import { ChatWriteRepository, ChatReadRepository } from "../../../infrastructure/database/repositories/chat.repository";
import { MessageOutputDto } from "../../../application/dtos/chat/get-chat-dto";

const roomReadRepo = new RoomReadRepository();
const roomWriteRepo = new RoomWriteRepository();
const chatWriteRepo = new ChatWriteRepository();
const chatReadRepo = new ChatReadRepository();

const sendMessageUseCase = new SendMessageUseCase(chatWriteRepo, roomReadRepo, roomWriteRepo);
const readRoomUseCase = new ReadRoomUseCase(roomReadRepo, chatWriteRepo, chatReadRepo);


export const chatSocket = (io: Server, socket: Socket) => {
  const currentUserID = socket.data.user.userId;

  socket.on("CLIENT_SEND_MESSAGE", async (data) => {
    try {
      const roomID = data.roomID;

      const {message  , memberIds}: SendMessageOutputDto = await sendMessageUseCase.execute({
        user_id: currentUserID,
        room_id: roomID,
        content: data.content,
        images: data.images,
      });

      memberIds?.forEach((memberId: string) => {
        io.to(memberId.toString()).emit("SERVER_RETURN_MESSAGE", message);
      });
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      socket.emit("SERVER_RETURN_ERROR", { message: "Gửi tin nhắn thất bại" });
    }
  });

  socket.on("CLIENT_SEND_TYPING", (data) => {
    socket.join(data.roomID);
    socket.broadcast.to(data.roomID).emit("SERVER_RETURN_TYPING", data);
  });

  socket.on("CLIENT_READ_ROOM", async (data) => {
    const { roomID, userID } = data;

    try {
      await readRoomUseCase.execute(roomID, userID);
      io.to(roomID).emit("SERVER_RETURN_UPDATE_READ_STATUS", data);
    } catch (error) {
      console.error("Error in CLIENT_READ_ROOM:", error);
    }
  });
};
