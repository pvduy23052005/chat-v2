import { RoomEntity } from "../../../domain/room/entity";
import { GetRoomOutputDTO } from "../../dtos/room/get-room.dto";
import { RoomDetailOutputDTO } from "../../dtos/room/get-detail-room.dto";

export interface IRoomReadRepository {
  findRoomWithUser(roomID: string, userID: string): Promise<any>;
  checkRoomExist(myID: string, userID: string): Promise<RoomEntity | null>;
  findRoomById(roomID: string): Promise<RoomEntity | null>;
  getRoomByUserAndStatus(userID: string, status: string): Promise<GetRoomOutputDTO[]>;
  getDetailById(roomID: string): Promise<RoomDetailOutputDTO | null>;
}

export interface IRoomWriteRepository {
  createNewRoom(room: RoomEntity): Promise<RoomEntity>;
  update(room: RoomEntity): Promise<void>;
  updateRoomTitle(roomID: string, title: string): Promise<void>;
  softDeleteRoom(roomID: string): Promise<void>;
  updateLastMessage(roomID: string, messageID: any): Promise<void>;
}
