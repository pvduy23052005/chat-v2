import Room from "../model/room.model";
import { IRoomReadRepository, IRoomWriteRepository, IRoomMemberRepository } from "../../../application/ports/repositories/room.port";
import { GetRoomOutputDTO } from "../../../application/dtos/room/get-room.dto";
import { RoomQueryMapper } from "../../../presentation/mappers/room.mapper";
import { RoomEntity } from "../../../domain/room/entity";
import { RoomDetailOutputDTO } from "../../../application/dtos/room/get-detail-room.dto";
import mongoose from "mongoose";

const mapToEntity = (doc: any): RoomEntity => {
  return RoomEntity.restore({
    id: doc._id.toString(),
    title: doc.title,
    typeRoom: doc.typeRoom,
    avatar: doc.avatar,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    members: doc.members,
    lastMessageId: doc.lastMessageId
  })
}

const ROOM_POPULATE_OPTIONS = [
  {
    path: "members.user_id",
    select: "fullName avatar statusOnline role",
  },
  {
    path: "lastMessageId",
    select: "content status user_id readBy",
  }
];

export class RoomReadRepository implements IRoomReadRepository {

  async getRoomByUserAndStatus(userID: string, status: string): Promise<GetRoomOutputDTO[]> {
    const userObjectID = new mongoose.Types.ObjectId(userID);

    const rooms = await Room.find({
      "members": {
        $elemMatch: {
          user_id: userObjectID,
          status: status
        }
      },
      deleted: false
    })
      .sort({ updatedAt: -1 })
      .populate(ROOM_POPULATE_OPTIONS)
      .lean() as any[];

    if (!rooms || rooms.length === 0) return [];

    return rooms.map((room) => RoomQueryMapper.toRoomDTO(room, userID));
  }

  async findRoomWithUser(roomID: string, userID: string) {
    const room = await Room.findOne({
      _id: roomID,
      "members.user_id": userID,
      deleted: false,
    }).populate(ROOM_POPULATE_OPTIONS).lean();

    return room;
  }

  async checkRoomExist(myID: string, userID: string): Promise<RoomEntity | null> {
    const room = await Room.findOne({
      typeRoom: "single",
      "members.user_id": {
        $all: [myID, userID]
      }
    }).lean();

    if (!room) return null;

    return mapToEntity(room);
  }

  async findRoomById(roomID: string): Promise<RoomEntity | null> {
    const room = await Room.findOne({
      _id: roomID,
      deleted: false
    }).lean();

    if (!room) return null;

    return mapToEntity(room);
  }

  async getDetailById(roomID: string): Promise<RoomDetailOutputDTO | null> {
    const room = await Room.findOne({
      _id: roomID,
      deleted: false
    }).populate(ROOM_POPULATE_OPTIONS).lean();

    if (!room) return null;

    return RoomQueryMapper.toDetailDTO(room);
  }
}

export class RoomWriteRepository implements IRoomWriteRepository {

  async createNewRoom(roomEntity: RoomEntity): Promise<RoomEntity> {
    const { id, ...roomData } = roomEntity.toObject();
    const newRoom = new Room(roomData);
    await newRoom.save();
    return mapToEntity(newRoom);
  }

  async update(roomEntity: RoomEntity): Promise<void> {
    const { id, ...roomData } = roomEntity.toObject();
    await Room.updateOne(
      { _id: id },
      { $set: { ...roomData } }
    );
  }

  async updateRoomTitle(roomID: string, title: string) {
    await Room.updateOne(
      { _id: roomID },
      { $set: { title: title } }
    );
  }

  async softDeleteRoom(roomID: string) {
    await Room.updateOne(
      { _id: roomID },
      { deleted: true, deletedAt: new Date() }
    );
  }

  async updateLastMessage(roomID: string, messageID: any): Promise<void> {
    await Room.updateOne(
      { _id: roomID },
      {
        lastMessageId: messageID,
        updatedAt: new Date()
      }
    );
  }
}

export class RoomMemberRepository implements IRoomMemberRepository {

  async addMembersToRoom(roomID: string, newMembers: { user_id: string, role: string, status: string }[]) {
    await Room.updateOne(
      { _id: roomID },
      { $push: { members: { $each: newMembers } } }
    );
  }

  async removeMemberFromRoom(roomID: string, memberID: string) {
    await Room.updateOne(
      { _id: roomID },
      { $pull: { members: { user_id: memberID } } }
    );
  }

  async assignAdminRole(roomID: string, memberID: string) {
    await Room.updateOne(
      { _id: roomID, "members.user_id": memberID },
      { $set: { "members.$.role": "superAdmin" } }
    );
  }

  async updateMemberStatus(roomID: string, status: string): Promise<void> {
    await Room.updateOne(
      { _id: roomID },
      { $set: { "members.$[].status": status } }
    );
  }
}
