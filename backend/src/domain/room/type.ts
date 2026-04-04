export interface ILastMessage {
  content: string,
  status: "sent" | "seen",
  user_id: string,
  readBy?: string[]
}

export interface IRoom {
  id?: string;
  title: string;
  typeRoom: "single" | "group";
  avatar?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  members: IRoomMember[];
  lastMessageId?: string;
}

export interface IRoomMember {
  user_id: string;
  role: "superAdmin" | "admin" | "member";
  status: "waiting" | "accepted" | "refused";
}
