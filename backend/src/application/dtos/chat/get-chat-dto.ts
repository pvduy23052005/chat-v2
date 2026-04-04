export interface ChatSenderOutputDto {
  id: string;
  fullName?: string;
  avatar?: string;
}

export interface ChatOutputDto {
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
  sender?: ChatSenderOutputDto;
}
