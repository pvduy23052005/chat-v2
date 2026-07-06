import { ChatProvider } from "../../context/ChatProvider";
import ChatSider from "../../components/chat/ChatSider";
import ChatMain from "../../components/chat/ChatMain";
import "../../styles/pages/chat/chatLayout.css";

function Chat() {
  return (
    <ChatProvider>
      <div className="chat-layout">
        {/* siderbar */}
        <ChatSider />
        {/* main */}
        <main className="chat-main-area">
          <ChatMain />
        </main>
      </div>
    </ChatProvider>
  );
}

export default Chat;
