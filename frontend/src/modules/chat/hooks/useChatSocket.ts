import { useRouter } from "next/navigation";
import { chatServiceAPI } from "@core/api/chatServiceAPI";
import { socket } from "@core/socket";
import { useEffect, useRef, useState } from "react";
import { updateSatusMessmasge_util } from "@core/utils/room.util";
import { chatServiceSocket } from "@core/socket/chatServiceSocket";
import { useAuth } from "@core/hooks/useAuth";
import { Message } from "@core/types";

export interface TypingData {
  roomID: string;
  fullName: string;
  avatar: string;
}

export const useChatSocket = (currentRoomID: string | null) => {
  const [chats, setChats] = useState<Message[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | number | null>(null);
  const [typingUser, setTypingUser] = useState<TypingData | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const router = useRouter();
  const { user } = useAuth();
  const myID = (user?._id || user?.id || "").toString();

  const loadMoreChats = async () => {
    if (!hasMore || chats.length === 0 || !currentRoomID) return;

    try {
      const cursor = chats[0]?.id || chats[0]?._id;
      if (!cursor) return;

      const res = await chatServiceAPI.getChats(currentRoomID, cursor);

      if (res.success) {
        const olderChats = res.chats || [];

        if (olderChats.length < 10) {
          setHasMore(false);
        }
        setChats((prevChats) => [...olderChats, ...prevChats]);
      }
    } catch (error) {
      console.log("Lỗi tải thêm tin nhắn:", error);
    }
  };

  useEffect(() => {
    if (!currentRoomID) return;

    const fetchInitialChats = async () => {
      try {
        const res = await chatServiceAPI.getChats(currentRoomID);

        if (res.success) {
          const fetchedChats = res.chats || [];
          setChats(fetchedChats);

          if (fetchedChats.length < 10) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }

          chatServiceSocket.userReadLastMessage({
            roomID: currentRoomID,
            userID: myID,
          });
        }
      } catch (error) {
        console.log("Lỗi lấy tin nhắn:", error);
        router.push("/chat");
      }
    };

    fetchInitialChats();

    const handleTyping = (data: TypingData) => {
      if (data.roomID !== currentRoomID) return;
      setTypingUser(data);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current as any);
      typingTimeoutRef.current = setTimeout(() => {
        setTypingUser(null);
      }, 3000);
    };

    const handleNewMessage = (newMessage: Message) => {
      if (newMessage.room_id === currentRoomID) {
        setChats((prev) => [...prev, newMessage]);
        chatServiceSocket.userReadLastMessage({
          roomID: currentRoomID,
          userID: myID,
        });
      }
    };

    const handleUpdateReadMessage = (data: { roomID: string; userID: string }) => {
      const { roomID, userID } = data;
      if (roomID === currentRoomID) {
        setChats((prevListMessage) => {
          const newListMessages = updateSatusMessmasge_util(
            prevListMessage,
            userID,
          );
          return newListMessages;
        });
      }
    };

    // socket.
    socket.on("SERVER_RETURN_MESSAGE", handleNewMessage);
    socket.on("SERVER_RETURN_TYPING", handleTyping);
    socket.on("SERVER_RETURN_UPDATE_READ_STATUS", handleUpdateReadMessage);

    return () => {
      socket.off("SERVER_RETURN_MESSAGE", handleNewMessage);
      socket.off("SERVER_RETURN_TYPING", handleTyping);
      socket.off("SERVER_RETURN_UPDATE_READ_STATUS", handleUpdateReadMessage);

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current as any);
      setChats([]);
      setTypingUser(null);
    };
  }, [currentRoomID, router, myID]);

  return {
    chats,
    typingUser,
    isShowTyping: !!typingUser,
    loadMoreChats,
    hasMore,
  };
};
