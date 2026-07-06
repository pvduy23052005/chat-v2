import { useEffect } from "react";
import { socket } from "../../socket";

export const useAuthSocket = (isLogin: boolean): void => {
  useEffect(() => {
    if (isLogin) {
      if (!socket.connected) {
        socket.connect();
      }
    } else {
      if (socket.connected) {
        console.log("Socket Disconnected");
        socket.disconnect();
      }
    }
  }, [isLogin]);
};
