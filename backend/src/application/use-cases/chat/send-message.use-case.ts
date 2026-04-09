import { IChatWriteRepository } from "../../ports/repositories/chat.port";
import { IRoomReadRepository, IRoomWriteRepository } from "../../ports/repositories/room.port";
import { ChatEntity } from "../../../domain/chat/chat.entity";
import { MessageOutputDto, MessageInputDto } from "../../dtos/chat/get-chat-dto";

export interface SendMessageOutputDto {
  message: MessageOutputDto;
  memberIds: string[];
}

export class SendMessageUseCase {

  constructor(
    private readonly chatWriteRepo: IChatWriteRepository,
    private readonly roomReadRepo: IRoomReadRepository,
    private readonly roomWriteRepo: IRoomWriteRepository,
  ) { }

  async execute(dataChat: MessageInputDto): Promise<SendMessageOutputDto> {
    const { user_id, room_id, content, images } = dataChat;

    const room = await this.roomReadRepo.findRoomById(room_id);
    if (!room) {
      throw new Error("Room not found");
    }

    const memberIds = room.getMembers().map((member: any) => member.user_id);

    const newMessage = ChatEntity.create({
      user_id: user_id,
      room_id: room_id,
      content: content,
      images: images,
    });

    const message = await this.chatWriteRepo.create(newMessage);

    if (!message) {
      throw new Error("Failed to create message");
    }

    this.roomWriteRepo.updateLastMessage(room_id, message.getId()).catch(error => console.log(error));

    return {
      message: message.getDetail(),
      memberIds: memberIds
    }
  }
}