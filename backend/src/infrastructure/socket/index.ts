import http from 'http';
import { Server, Socket } from 'socket.io';

import { authSocketMiddleware } from '../../presentation/socket/middleware/auth.middleware';
import { chatSocket } from '../../presentation/socket/handler/chat.handler';
import { roomSocket } from '../../presentation/socket/handler/room.handler';
import { userSocket } from '../../presentation/socket/handler/user.handler';

export const socketInit = (httpServer: http.Server) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  (global as any)._io = io;

  io.use(authSocketMiddleware);

  io.on("connection", async (socket: Socket) => {
    const myID = socket.data.user.userId;

    socket.join(myID);

    chatSocket(io, socket);
    userSocket(io, socket);
    roomSocket(io, socket);
  });
};
