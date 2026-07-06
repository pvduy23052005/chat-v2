import ChatMessageFooter from "./ChatMessageFooter";
import ChatMessageGroup from "./ChatMessageGroup";
import { useChatSocket } from "../../hook/socket/useChatSocket";
import EmptyChatState from "../common/EmptyChat";
import ChatHeader from "./ChatHeader";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import "../../styles/pages/chat/chatLayout.css";

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
