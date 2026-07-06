"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { useAuth } from "@core/hooks/useAuth";
import { useContext, useState } from "react";
import { ChatContext } from "@core/context/ChatContext";
import { IoSearchOutline } from "react-icons/io5";
import "../styles/chatSider.css";
import { Room } from "@core/types";

function ChatSider() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const currentRoomID = searchParams ? searchParams.get("roomId") : null;
  const { rooms, onlineUserIDs } = useContext(ChatContext);
  const [searchRoom, setSearchRoom] = useState<string>("");
  const pathname = usePathname() || "";

  const formatLastTime = (dateStr?: string | Date): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins}p`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}ng`;
  };

  const filteredRooms = rooms?.filter((room: Room) =>
    room.title?.toLowerCase().includes(searchRoom.toLowerCase()),
  );

  const isNotFriend = pathname.includes("/not-friend");

  return (
    <aside className="sidebar-left">
      {/* Header */}
      <div className="sidebar-header">
        <h2 className="sidebar-title">Tin nhắn</h2>

        {/* Search room */}
        <div className="sidebar-search">
          <IoSearchOutline className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchRoom}
            onChange={(e) => setSearchRoom(e.target.value)}
          />
        </div>

        {/* nav-tabs */}
        <div className="sidebar-tabs">
          <Link
            href="/chat"
            className={`sidebar-tab ${!isNotFriend ? "active" : ""}`}
          >
            Tất cả
          </Link>
          <Link
            href="/chat/not-friend"
            className={`sidebar-tab ${isNotFriend ? "active" : ""}`}
          >
            Tin nhắn chờ
          </Link>
        </div>
      </div>

      {/* Conversation List */}
      <div className="conversation-list">
        {filteredRooms &&
          filteredRooms.map((room: Room) => {
            const myId = user?._id || user?.id;
            const lastMsg = (room.lastMessage || {}) as any;
            const lastMsgUserId = lastMsg.user_id?.toString();
            const isMe = lastMsgUserId === myId?.toString();
            const isSystem = lastMsg.type === "system";

            let prefix = "";
            if (!isSystem && lastMsgUserId) {
              if (isMe) {
                prefix = "Bạn: ";
              } else if (room.typeRoom === "group") {
                const sender = room.members?.find((m) => {
                  const mId = typeof m.user_id === "string" ? m.user_id : m.user_id.id || m.user_id._id;
                  return mId?.toString() === lastMsgUserId;
                });
                const senderName = sender && typeof sender.user_id !== "string" ? sender.user_id.fullName : "";
                prefix = senderName ? `${senderName}: ` : "";
              }
            }

            const isRead = room.lastMessage?.readBy?.includes(myId || "");
            const classRead = isRead ? "" : "unread";
            const messageContent = lastMsg.content || "Bắt đầu cuộc trò chuyện";

            const isOnline = room.otherUserId ? onlineUserIDs.includes(room.otherUserId) : false;
            const isActive = currentRoomID === room.id;

            return (
              <Link
                href={`${pathname}?roomId=${room.id}`}
                key={room.id}
                className={`conversation-item ${isActive ? "active" : ""}`}
              >
                {/* Avatar */}
                <div className="conv-avatar">
                  <img
                    src={room.avatar || "/images/default-avatar.webp"}
                    alt={room.title}
                  />
                  {isOnline && <span className="online-dot"></span>}
                </div>

                {/* Content */}
                <div className="conv-content">
                  <div className="conv-top">
                    <span className="conv-name">{room.title}</span>
                    <span className="conv-time">
                      {formatLastTime(lastMsg.createdAt)}
                    </span>
                  </div>
                  <p className={`conv-preview ${classRead}`}>
                    {prefix}
                    {messageContent}
                  </p>
                </div>
              </Link>
            );
          })}
      </div>
    </aside>
  );
}

export default ChatSider;
