import { useAuth } from "@core/hooks/useAuth";
import { useEffect, useRef, useLayoutEffect } from "react";
import { formatTime } from "@core/utils/chat.utils";
import FileAttachment from "./FileAttachment";
import TypingChat from "@core/components/TypingChat";
import "../styles/chatMessages.css";
import { Message } from "@core/types";

interface ChatMessageGroupProps {
  chats: Message[];
  isShowTyping: boolean;
  typingUser: any;
  onLoadMore: () => Promise<void>;
  hasMore: boolean;
}

function ChatMessageGroup({
  chats,
  isShowTyping,
  typingUser,
  onLoadMore,
  hasMore,
}: ChatMessageGroupProps) {
  const { user } = useAuth();
  const myID = user?._id || user?.id;

  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const oldScrollHeightRef = useRef<number>(0);
  const isFetchingOldRef = useRef<boolean>(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop === 0 && hasMore) {
      isFetchingOldRef.current = true;
      oldScrollHeightRef.current = e.currentTarget.scrollHeight;
      if (onLoadMore) {
        onLoadMore();
      }
    }
  };

  useLayoutEffect(() => {
    if (containerRef.current) {
      if (isFetchingOldRef.current) {
        const newScrollHeight = containerRef.current.scrollHeight;
        containerRef.current.scrollTop =
          newScrollHeight - oldScrollHeightRef.current;
        isFetchingOldRef.current = false;
      } else {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [chats]);

  useEffect(() => {
    if (isShowTyping) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isShowTyping]);

  return (
    <div
      className="chat-message-body"
      ref={containerRef}
      onScroll={handleScroll}
    >
      {chats &&
        chats.map((chat, index) => {
          const isSystem = chat.type === "system";

          if (isSystem) {
            return (
              <div className="system-message" key={chat.id || chat._id || index}>
                <span>{chat.content}</span>
              </div>
            );
          }

          const sender = (chat as any).sender;
          const senderId = sender?.id || sender?._id;
          const senderIdStr = senderId?.toString() || "";
          const isMe = senderIdStr === myID?.toString();
          const time = formatTime(chat.createdAt);
          const isSeen = (chat.readBy?.length || 0) > 1;

          const prevChat = chats[index - 1];
          const prevSenderId = (prevChat as any)?.sender?.id || (prevChat as any)?.sender?._id;
          const isFirstInGroup =
            !prevChat ||
            prevChat.type === "system" ||
            prevSenderId?.toString() !== senderIdStr;

          const nextChat = chats[index + 1];
          const nextSenderId = (nextChat as any)?.sender?.id || (nextChat as any)?.sender?._id;
          const isLastInGroup =
            !nextChat ||
            nextChat.type === "system" ||
            nextSenderId?.toString() !== senderIdStr;

          return (
            <div
              key={chat.id || chat._id || index}
              className={`message-row ${isMe ? "outgoing" : "incoming"} ${
                isLastInGroup ? "last-in-group" : ""
              }`}
            >
              {!isMe && (
                <div className="message-avatar">
                  {isLastInGroup ? (
                    <img
                      src={sender?.avatar || "/images/default-avatar.webp"}
                      alt="Avatar"
                      title={sender?.fullName}
                    />
                  ) : (
                    <div className="avatar-placeholder" />
                  )}
                </div>
              )}

              <div className="message-content-wrapper">
                {!isMe && isFirstInGroup && (
                  <span className="sender-name">{sender?.fullName}</span>
                )}
                <div className="message-bubble">
                  {chat.content && <p className="text">{chat.content}</p>}

                  {chat.images && chat.images.length > 0 && (
                    <div className="message-images">
                      <FileAttachment linkFile={chat.images} />
                    </div>
                  )}
                </div>

                {isLastInGroup && (
                  <div className="message-meta">
                    <span className="timestamp">{time}</span>
                    {isMe && (
                      <span className={`status ${isSeen ? "seen" : "sent"}`}>
                        {isSeen ? "Đã xem" : "Đã gửi"}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

      {isShowTyping && <TypingChat user={typingUser} />}

      <div ref={bottomRef}></div>
    </div>
  );
}

export default ChatMessageGroup;
