import type { GetRoomOutputDTO } from "../../application/dtos/room/get-room.dto";
import type { RoomDetailOutputDTO } from "../../application/dtos/room/get-detail-room.dto";

export class RoomQueryMapper {
  public static toRoomDTO(rawRoom: any, currentUserID: string): GetRoomOutputDTO {
    let title = rawRoom.title;
    let avatar = rawRoom.avatar || "/images/default-avatar.webp";
    let otherUserId = "";

    if (rawRoom.typeRoom === "single") {
      const otherMember = rawRoom.members.find(
        (m: any) => m.user_id && m.user_id._id.toString() !== currentUserID
      );

      if (otherMember && otherMember.user_id) {
        title = otherMember.user_id.fullName;
        avatar = otherMember.user_id.avatar || "/images/default-avatar.webp";
        otherUserId = otherMember.user_id._id.toString();
      }
    }

    const lastMessage = !rawRoom.lastMessageId
      ? { content: "Bắt đầu trò chuyện ngay", status: "seen", user_id: "" }
      : {
        content: rawRoom.lastMessageId.content,
        status: rawRoom.lastMessageId.status,
        user_id: rawRoom.lastMessageId.user_id?.toString() || "",
        readBy: rawRoom.lastMessageId.readBy
      };

    const isMemberOnline = rawRoom.members.some(
      (m: any) =>
        m.user_id &&
        m.user_id._id.toString() !== currentUserID &&
        m.user_id.statusOnline === "online"
    );

    return {
      id: rawRoom._id.toString(),
      title,
      typeRoom: rawRoom.typeRoom,
      avatar,
      lastMessage,
      statusOnline: isMemberOnline ? "online" : "offline",
      updatedAt: rawRoom.updatedAt,
      otherUserId,
    };
  }

  public static toDetailDTO(rawRoom: any): RoomDetailOutputDTO {
    return {
      id: rawRoom._id.toString(),
      title: rawRoom.title,
      typeRoom: rawRoom.typeRoom,
      avatar: rawRoom.avatar || "/images/default-avatar.webp",
      members: (rawRoom.members || [])
        .filter((m: any) => m?.user_id?._id)
        .map((m: any) => ({
          id: m.user_id._id.toString(),
          fullName: m.user_id.fullName,
          avatar: m.user_id.avatar || "/images/default-avatar.webp",
          role: m.role,
        }))
    };
  }
}