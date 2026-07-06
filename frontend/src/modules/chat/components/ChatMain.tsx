import ChatMessageFooter from "./ChatMessageFooter";
import ChatMessageGroup from "./ChatMessageGroup";
import { useChatSocket } from "@modules/chat/hooks/useChatSocket";
import EmptyChatState from "@core/components/EmptyChat";
import ChatHeader from "./ChatHeader";
import { useContext } from "react";
import { ChatContext } from "@core/context/ChatContext";
import "../styles/chatLayout.css";

interface ChatMainProps {
  toggleInfo?: () => void;
}

function ChatMain({ toggleInfo }: ChatMainProps) {
  const { currentRoomID, currentRoomInfo } = useContext(ChatContext);
  const { 
    chats, 
    isShowTyping, 
    typingUser,
    loadMoreChats,
    hasMore,
  } = useChatSocket(currentRoomID);
  
  return (
    <div className="chat-main-body">
      {currentRoomID ? (
        <>
          <ChatHeader
            currentRoomInfo={currentRoomInfo}
            toggleInfo={toggleInfo}
          />

          <ChatMessageGroup
            chats={chats}
            isShowTyping={isShowTyping}
            typingUser={typingUser}
            onLoadMore={loadMoreChats}
            hasMore={hasMore}
          />

          <ChatMessageFooter />
        </>
      ) : (
        <EmptyChatState />
      )}
    </div>
  );
}

export default ChatMain;
