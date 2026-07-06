import { useState, useEffect } from "react";
import { roomServiceAPI } from "@core/api/roomServiceAPI";
import { useRouter } from "next/navigation";
import { Room, UserProfile } from "@core/types";

export const useRoomDetail = (roomID: string | null) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [friends, setFriends] = useState<UserProfile[] | null>(null);
  const router = useRouter();

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
        router.push("/chat");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomID, router]);

  return { room, setRoom, setFriends, loading, error, friends };
};
