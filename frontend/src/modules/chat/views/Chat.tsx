import { ChatProvider } from "@core/context/ChatProvider";
import ChatSider from "@modules/chat/components/ChatSider";
import ChatMain from "@modules/chat/components/ChatMain";
import "../styles/chatLayout.css";

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
