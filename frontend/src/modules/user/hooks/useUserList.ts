import { useEffect, useState } from "react";
import { socket } from "@core/socket";
import { useRouter } from "next/navigation";
import { userServiceAPI } from "@core/api/userServiceAPI";
import { UserProfile } from "@core/types";

export const useUserList = () => {
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    const handleGetUsers = async () => {
      try {
        const res = await userServiceAPI.getUsers();
        setUsers(res.users);
      } catch (error: any) {
        console.log(error.response?.data?.message);
      }
    };
    handleGetUsers();
  }, []);

  useEffect(() => {
    const handleReturnRoomNotFriendID = (data: { roomID: string }) => {
      const { roomID } = data;
      router.push(`/chat/not-friend?roomId=${roomID}`);
    };

    // socket
    socket.on("SERVER_SEND_ROOM_NOT_FRIEND_ID", handleReturnRoomNotFriendID);

    return () => {
      socket.off("SERVER_SEND_ROOM_NOT_FRIEND_ID", handleReturnRoomNotFriendID);
    };
  }, [router]);

  return {
    users,
    setUsers,
  };
};
