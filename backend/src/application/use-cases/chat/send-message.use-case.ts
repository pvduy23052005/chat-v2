import { IChatWriteRepository } from "../../ports/repositories/chat.port";
import { IRoomWriteRepository } from "../../ports/repositories/room.port";
import { ChatEntity } from "../../../domain/chat/chat.entity";
import { ChatOutputDto } from "../../dtos/chat/get-chat-dto";
export interface IDataChat {
  user_id: string;
  content: string;
  room_id: string;
  images: string[];
}

export class SendMessageUseCase {

  constructor(
    private readonly chatWriteRepo: IChatWriteRepository,
    private readonly roomRepo: IRoomWriteRepository,
  ) { }

  async execute(dataChat: IDataChat): Promise<ChatOutputDto | null> {
    const { user_id, room_id, content, images } = dataChat;

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

    await this.roomRepo.updateLastMessage(room_id, message.getId());

    return message.getDetail() || null;
  }
}