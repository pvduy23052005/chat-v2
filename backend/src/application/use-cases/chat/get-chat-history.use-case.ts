import { IChatReadRepository } from "../../ports/repositories/chat.port";
import { IRoomReadRepository } from "../../ports/repositories/room.port";
import { ChatOutputDto } from "../../dtos/chat/get-chat-dto";

export class GetChatHistoryUseCase {

  constructor(
    private readonly chatRepository: IChatReadRepository,
    private readonly roomRepository: IRoomReadRepository
  ) { }

  public async execute(userId: string, roomID: string, cursor?: string, limit: number = 15): Promise<ChatOutputDto[]> {

    const room = await this.roomRepository.findRoomById(roomID);

    if (!room) {
      throw new Error("Vui lòng cung cấp ID phòng");
    }

    room.checkIsMember(userId);

    const listMessages = await this.chatRepository.getMessageByRoomID(roomID, cursor, limit);

    return listMessages?.map(message => message.getDetail()) || [];
  }
}
