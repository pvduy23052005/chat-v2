import { IRoomWriteRepository } from "../../../ports/repositories/room.port";
import { RoomEntity } from "../../../../domain/room/entity";

export interface CreateRoomOutputDTO {
  id: string;
  title: string;
}

export class CreateNewRoomUseCase {
  constructor(
    private readonly roomWriteRepo: IRoomWriteRepository
  ) { }

  async execute(myId: string, titleRoom: string, members: string[]): Promise<CreateRoomOutputDTO> {

    if (!titleRoom) {
      throw new Error("Nhập tên phòng");
    }

    if (!members) {
      throw new Error("Vui lòng chọn thành viên");
    }

    const memberIDs: string[] = Array.isArray(members)
      ? [...members]
      : [members];

    if (memberIDs.length < 2) {
      throw new Error("Vui lòng chọn trên 2 người!");
    }

    const room = RoomEntity.createGroupRoom(myId, memberIDs, titleRoom);

    const newRoom = await this.roomWriteRepo.createNewRoom(room);

    return {
      id: newRoom.getId(),
      title: newRoom.getTitle()
    };
  }
}
