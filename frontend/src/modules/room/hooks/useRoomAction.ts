import { roomServiceAPI } from "@core/api/roomServiceAPI";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { roomServiceSocket } from "@core/socket/roomServiceSocket";
import { updateAdminForRoom_util } from "@core/utils/room.util";
import { Room } from "@core/types";

export const useRoomAction = () => {
  const router = useRouter();

  const deleteRoom = async (roomID: string, roomTitle: string = "nhóm này"): Promise<void> => {
    const isConfirm = window.confirm(
      `Bạn có chắc chắn muốn xóa ${roomTitle}? Hành động này không thể hoàn tác.`,
    );
    if (!isConfirm) return;
    try {
      const res = await roomServiceAPI.delete(roomID);
      if (res.success) {
        toast.success("Xóa nhóm thành công!");
        router.push("/chat");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi xóa nhóm");
    }
  };

  const removeMember = async (
    roomID: string,
    memberID: string,
    fullName: string,
    setRoom?: React.Dispatch<React.SetStateAction<Room | null>>,
  ): Promise<void> => {
    try {
      const res = await roomServiceAPI.removeMember(roomID, memberID);
      if (res.success) {
        toast.success(`Đã xóa ${fullName} khỏi nhóm`);
        if (setRoom) {
          setRoom((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              members: prev.members ? prev.members.filter((m) => {
                const mId = typeof m.user_id === "string" ? m.user_id : m.user_id.id;
                return mId !== memberID;
              }) : [],
            };
          });
        }
        // emit socket .
        roomServiceSocket.removeMember(roomID, memberID, fullName);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi xóa thành viên");
    }
  };

  const leaveRoom = async (roomID: string, fullName: string): Promise<void> => {
    const confirm = window.confirm("Bạn có chắc chắn muốn rời nhóm");

    if (!confirm) {
      return;
    }

    try {
      const res = await roomServiceAPI.leaveRoom(roomID);
      if (res.success) {
        toast.success("Bạn đã rời nhóm");
        router.push("/chat");
        // emit socket .
        roomServiceSocket.leaveRoom(roomID, fullName);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi rời nhóm");
    }
  };

  const addMember = async (roomID: string, memberIDs: string[], listFullNames: string[]): Promise<void> => {
    try {
      const res = await roomServiceAPI.addMember(roomID, memberIDs);

      if (res.success) {
        toast.success(res.message);
        // call socket .
        roomServiceSocket.addMembers(roomID, memberIDs, listFullNames);
        router.back();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi thêm thành viên");
    }
  };

  const assignAdmin = async (
    roomID: string,
    memberID: string,
    fullName: string,
    setRoom?: React.Dispatch<React.SetStateAction<Room | null>>,
  ): Promise<void> => {
    try {
      const res = await roomServiceAPI.assignAdmin(roomID, memberID);
      if (res.success) {
        if (setRoom) {
          setRoom((prevRoom) => {
            if (!prevRoom) return null;
            return updateAdminForRoom_util(prevRoom, memberID);
          });
        }
        // socket .
        roomServiceSocket.assignAdmin(roomID, fullName);
        toast.success("Phong trưởng nhóm thành công!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi phong trưởng nhóm");
    }
  };

  const editRoom = async (
    roomID: string,
    title: string,
    setRoom?: React.Dispatch<React.SetStateAction<Room | null>>,
  ): Promise<boolean> => {
    try {
      const res = await roomServiceAPI.edit(roomID, title);
      if (res.success) {
        toast.success(res.message);
        if (setRoom) {
          setRoom((prev) => {
            if (!prev) return null;
            return { ...prev, title };
          });
        }
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật tên");
      return false;
    }
  };

  return {
    deleteRoom,
    removeMember,
    leaveRoom,
    addMember,
    assignAdmin,
    editRoom,
  };
};
