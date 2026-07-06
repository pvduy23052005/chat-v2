import "@core/styles/emptyChat.css";
import Link from "next/link";

function EmptyChatState() {
  return (
    <div className="empty-chat-container">
      <div className="empty-chat-icon">
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <circle cx="9" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="10" r="1" fill="currentColor" />
          <path d="M9 14s1 1 3 1 3-1 3-1" />
        </svg>
      </div>
      <h3 className="empty-chat-title">Bắt đầu cuộc trò chuyện</h3>
      <p className="empty-chat-text">Bạn muốn nhắn tin với ai?</p>
      <div className="empty-chat-suggestions">
        <Link href="/user">
          <div className="suggestion-item">
            <span className="suggestion-icon">👋</span>
            <span>Gửi lời chào</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default EmptyChatState;
