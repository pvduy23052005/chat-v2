import { IRoomReadRepository, IRoomWriteRepository } from "../../ports/repositories/room.port";
import { RoomEntity } from "../../../domain/room/entity";

export class ChatNotFriendUseCase {
  constructor(
    private readonly roomReadRepo: IRoomReadRepository,
    private readonly roomWriteRepo: IRoomWriteRepository
  ) { }

  async execute(myID: string, userID: string): Promise<string> {
    const existRoom = await this.roomReadRepo.checkRoomExist(myID, userID);

    if (existRoom) {
      return existRoom.getId();
    } else {
      const newRoomEntity = RoomEntity.createSingleRoom(myID, userID);

      const newRoom = await this.roomWriteRepo.createNewRoom(newRoomEntity);
      return newRoom.getId();
    }
  }
}
