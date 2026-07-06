import { useState, useEffect } from "react";
import { roomServiceAPI } from "../../services/roomServiceAPI";
import { useNavigate } from "react-router-dom";
import { Room, UserProfile } from "../../types";

export const useRoomDetail = (roomID: string | null) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [friends, setFriends] = useState<UserProfile[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoom = async () => {
      if (!roomID) return;

      setLoading(true);
      setError(null);

      try {
        const res = await roomServiceAPI.getDetail(roomID);
        if (res.success) {
          setRoom(res.room);
          setFriends(res.friends);
        } else {
          setError("Không tìm thấy dữ liệu phòng");
        }
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Lỗi tải thông tin phòng");
        navigate("/chat");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomID, navigate]);

  return { room, setRoom, setFriends, loading, error, friends };
};
