"use client";
import { useEffect, useRef, useState, ReactNode } from "react";
import { ChatContext } from "./ChatContext";
import { usePathname, useSearchParams } from "next/navigation";
import { chatServiceAPI } from "@core/api/chatServiceAPI";
import { socket } from "../socket/index";
import { useAuth } from "@core/hooks/useAuth";
import {
  markRoomRead_util,
  updateLastMessageAndReorder_util,
} from "@core/utils/room.util";
import { chatServiceSocket } from "@core/socket/chatServiceSocket";
import { Room, Message, UserProfile } from "@core/types";

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const pathname = usePathname() || "";
  const [onlineUserIDs, setOnlineUserIDs] = useState<string[]>([]);
  const { user } = useAuth();
  const userId = user?.id || user?._id || "";

  // current room id  .
  const currentRoomID = searchParams ? searchParams.get("roomId") : null;
  const currentRoomInfo = rooms.find((room) => room.id === currentRoomID);

  const currentRoomIDRef = useRef<string | null>(currentRoomID);
  const userRef = useRef<UserProfile | null>(user);

  useEffect(() => {
    currentRoomIDRef.current = currentRoomID;
  }, [currentRoomID]);
  
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    if (userId && currentRoomID) {
      // socket
      chatServiceSocket.userReadLastMessage({
        roomID: currentRoomID,
        userID: userId,
      });

      setRooms((prevRooms) => {
        const newListRooms = markRoomRead_util(
          prevRooms,
          currentRoomID,
          userId,
        );
        return newListRooms;
      });
    }
  }, [currentRoomID, userId]);

  // online status .
  useEffect(() => {
    const handleRoomStatus = ({ userID, status }: { userID: string; status: string }) => {
      setOnlineUserIDs((currentOnlineIDs) => {
        if (status === "online") {
          return currentOnlineIDs.includes(userID)
            ? currentOnlineIDs
            : [...currentOnlineIDs, userID];
        } else {
          return currentOnlineIDs.filter((id) => id != userID);
        }
      });
    };

    socket.on("SERVER_RETURN_ROOM_STATUS", handleRoomStatus);
    return () => {
      socket.off("SERVER_RETURN_ROOM_STATUS", handleRoomStatus);
    };
  }, []);

  // fetch room
  useEffect(() => {
    const handleGetRooms = async () => {
      setIsLoading(true);
      try {
        let res: any = [];
        if (pathname.includes("/not-friend")) {
          res = await chatServiceAPI.getRoomWaitings();
        } else {
          res = await chatServiceAPI.getRoomAcceptes();
        }
        setRooms(res.rooms || []);
        const listUserOnlines = (res.rooms || [])
          .filter((room: Room) => room.statusOnline === "online")
          .map((room: Room) => room.otherUserId || "");
        setOnlineUserIDs(listUserOnlines);
      } catch (error: any) {
        console.log(error.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    };
    handleGetRooms();
  }, [pathname]);

  // real-time view last-message .
  useEffect(() => {
    const handleNewMessage = (newMessage: Message) => {
      const openingRoomID = currentRoomIDRef.current;
      const currentUser = userRef.current;
      const myID = currentUser?.id || currentUser?._id || "";
      const isMyMessage = newMessage.user_id === myID;

      if (isMyMessage || openingRoomID === newMessage.room_id) {
        if (!newMessage.readBy) newMessage.readBy = [];
        
        if (!newMessage.readBy.includes(myID)) {
          newMessage.readBy.push(myID);
        }
        
        if (!isMyMessage && openingRoomID === newMessage.room_id) {
          // socket .
          chatServiceSocket.userReadLastMessage({
            roomID: openingRoomID,
            userID: myID,
          });
        }
      }
      setRooms((prevRooms) => {
        const newListRooms = updateLastMessageAndReorder_util(
          prevRooms,
          newMessage,
        );
        return newListRooms;
      });
    };

    // socket on .
    socket.on("SERVER_RETURN_MESSAGE", handleNewMessage);

    return () => {
      socket.off("SERVER_RETURN_MESSAGE", handleNewMessage);
    };
  }, []);

  return (
    <ChatContext.Provider
      value={{
        rooms,
        currentRoomID,
        currentRoomInfo,
        isLoading,
        onlineUserIDs,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
