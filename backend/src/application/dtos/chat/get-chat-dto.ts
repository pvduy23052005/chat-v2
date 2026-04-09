export interface MessageInputDto {
  user_id: string;
  content: string;
  room_id: string;
  images: string[];
}

export interface MessageSenderOutputDto {
  id: string;
  fullName?: string;
  avatar?: string;
}

export interface MessageOutputDto {
  id: string | undefined;
  user_id?: string | undefined;
  room_id: string;
  content: string;
  images: string[];
  type: string;
  status: string;
  readBy: string[];
  deleted: boolean;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  sender?: MessageSenderOutputDto;
}
