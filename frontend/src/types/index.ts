export interface UserProfile {
  id: string;
  _id?: string;
  fullName: string;
  email: string;
  avatar?: string;
  statusOnline?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoomMember {
  user_id: string | UserProfile;
  role: "superAdmin" | "admin" | "member";
  status: "waiting" | "accepted" | "refused";
}

export interface Message {
  id?: string;
  _id?: string;
  room_id: string;
  user_id: string;
  content?: string;
  images?: string[];
  files?: string[];
  type?: "text" | "image" | "file" | "system";
  readBy?: string[];
  createdAt?: string;
  updatedAt?: string;
  userProfile?: {
    fullName: string;
    avatar: string;
  };
}

export interface Room {
  id: string;
  _id?: string;
  title: string;
  typeRoom: "single" | "group";
  avatar?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  members?: RoomMember[];
  lastMessageId?: string;
  lastMessage?: Message;
  otherUserId?: string;
  statusOnline?: string;
}

export interface Friend {
  id: string;
  userId1: string;
  userId2: string;
  roomChatId: string;
  createdAt?: string;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: "pending" | "accepted" | "refused";
  senderProfile?: {
    fullName: string;
    avatar: string;
  };
  createdAt?: string;
}
