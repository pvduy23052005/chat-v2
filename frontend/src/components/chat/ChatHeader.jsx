import {
  IoEllipsisVertical,
} from "react-icons/io5";
import "../../styles/pages/chat/chatHeader.css";
import { Link } from "react-router-dom";

function ChatHeader({ currentRoomInfo }) {
  if (!currentRoomInfo) {
    return (
      <div className="chat-header loading">
        <span>Đang tải thông tin...</span>
      </div>
    );
  }

  const avatar = currentRoomInfo.avatar || "/images/default-avatar.webp";
  const name =
    currentRoomInfo.title || currentRoomInfo.fullName || "Người dùng";

  const isOnline =
    currentRoomInfo.statusOnline === "online" || currentRoomInfo.isOnline;

  return (
    <div className="chat-header">
      <div className="chat-header-left">
        <div className="chat-header-avatar">
          <img src={avatar} alt={name} />
          {isOnline && <span className="status-dot"></span>}
        </div>

        <div className="chat-header-info">
          <h3 className="chat-header-name">{name}</h3>
          <p className={`chat-header-status ${isOnline ? "online" : ""}`}>
            {isOnline ? "Đang hoạt động" : "Ngoại tuyến"}
          </p>
        </div>
      </div>

      <div className="chat-header-actions">
        <Link 
          to = {`/room/detail/${currentRoomInfo.id}`} 
          className="chat-header-btn" title="Thông tin phòng">
          <IoEllipsisVertical size={24} />
        </Link>
      </div>
    </div>
  );
}

export default ChatHeader;
