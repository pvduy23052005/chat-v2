import "@core/styles/typingChat.css";
import { UserProfile } from "@core/types";

interface TypingChatProps {
  user: UserProfile | { fullName?: string; avatar?: string } | null;
  showAvatar?: boolean;
}

function TypingChat({ user, showAvatar = true }: TypingChatProps) {
  return (
    <>
      <div className="typing-indicator-container">
        {showAvatar && (
          <div className="typing-avatar">
            <img
              src={user?.avatar || "/images/default-avatar.webp"}
              alt={user?.fullName || "User"}
            />
          </div>
        )}
        <div className="typing-bubble">
          <div className="typing-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      </div>
    </>
  );
}

export default TypingChat;
