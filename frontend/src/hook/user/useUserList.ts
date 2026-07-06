import { useEffect, useState } from "react";
import { socket } from "../../socket";
import { useNavigate } from "react-router-dom";
import { userServiceAPI } from "../../services/userServiceAPI";
import { UserProfile } from "../../types";

export const useUserList = () => {
  const navigate = useNavigate();
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
      navigate(`/chat/not-friend?roomId=${roomID}`);
    };

    // socket
    socket.on("SERVER_SEND_ROOM_NOT_FRIEND_ID", handleReturnRoomNotFriendID);

    return () => {
      socket.off("SERVER_SEND_ROOM_NOT_FRIEND_ID", handleReturnRoomNotFriendID);
    };
  }, [navigate]);

  return {
    users,
    setUsers,
  };
};
