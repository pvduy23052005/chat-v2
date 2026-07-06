import { Room, Message } from "@core/types";

// handle user already read ?
export const markRoomRead_util = (rooms: Room[], currentRoomID: string, myID: string): Room[] => {
  const newListRooms = rooms.map((room) => {
    const oldReadBy = room.lastMessage?.readBy || [];

    const roomID = room.id || room._id;
    if (roomID !== currentRoomID) {
      return room;
    }

    if (oldReadBy.includes(myID)) {
      return room;
    }

    const NewReadBy = [...oldReadBy, myID];

    const newRoom = {
      ...room,
      lastMessage: room.lastMessage ? {
        ...room.lastMessage,
        readBy: NewReadBy,
      } : undefined,
    };
    return newRoom;
  });
  return newListRooms;
};

// handle last-message real-time .
export const updateLastMessageAndReorder_util = (rooms: Room[], newMessage: Message): Room[] => {
  const roomIndex = rooms.findIndex(
    (room) => (room.id || room._id) === newMessage.room_id,
  );

  if (roomIndex === -1) return rooms;

  const newListRooms = [...rooms];

  const roomToUpdate = { ...newListRooms[roomIndex] } as Room;

  roomToUpdate.lastMessage = {
    room_id: newMessage.room_id,
    content: newMessage.content,
    createdAt: newMessage.createdAt,
    user_id:
      newMessage.user_id,
    readBy: newMessage.readBy,
  };

  newListRooms.splice(roomIndex, 1);
  newListRooms.unshift(roomToUpdate);

  return newListRooms;
};

export const updateSatusMessmasge_util = (chats: Message[], myID: string): Message[] => {
  const newListMessages = chats.map((message) => {
    const currentReadList = message.readBy || [];
    const isUserAlreadyRead = currentReadList.includes(myID);

    if (isUserAlreadyRead) {
      return message;
    }

    const newMessage = {
      ...message,
      readBy: [...currentReadList, myID],
    };

    return newMessage;
  });

  return newListMessages;
};

export const updateAdminForRoom_util = (room: Room, memberID: string): Room => {
  const updateMemberRoom = room.members?.map((member) => {
    const memberUserId = typeof member.user_id === "string" ? member.user_id : member.user_id.id;
    if (memberUserId !== memberID) {
      return member;
    }

    const updateMember = {
      ...member,
      role: "superAdmin" as const,
    };

    return updateMember;
  }) || [];

  return {
    ...room,
    members: updateMemberRoom,
  };
};
