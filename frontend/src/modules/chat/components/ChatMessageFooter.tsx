import { useRef, useState, useContext } from "react";
import { CiPaperplane } from "react-icons/ci";
import { MdInsertEmoticon } from "react-icons/md";
import { CgAttachment } from "react-icons/cg";
import { chatServiceSocket } from "@core/socket/chatServiceSocket";
import EmojiPickerAttachment from "./EmojiPickerAttachment";
import { ChatContext } from "@core/context/ChatContext";
import PreviewImage, { PreviewFile } from "./PreviewImageAttachment";
import { uploadFile } from "@core/utils/uploadFile.utils";
import { useAuth } from "@core/hooks/useAuth";
import "../styles/chatFooter.css";
import { EmojiClickData } from "emoji-picker-react";

function ChatMessageFooter() {
  const [content, setContent] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const { currentRoomID } = useContext(ChatContext);
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const userIdStr = (user?.id || user?._id || "").toString();

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setContent((prev) => prev + emojiData.emoji);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content && files.length === 0) {
      inputRef.current?.focus();
      return;
    }

    const urls = await uploadFile(files);
    chatServiceSocket.sendMessage({
      content: content,
      roomID: currentRoomID,
      images: urls,
    });

    setContent("");
    setFiles([]);
    setShowEmoji(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);

    chatServiceSocket.sendTyping({
      roomID: currentRoomID,
      isShow: true,
      user_id: userIdStr,
      avatar: user?.avatar || "",
      fullName: user?.fullName || "",
    });
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="chat-message-footer">
      <form onSubmit={handleSubmit} className="chat-footer-form">
        <PreviewImage
          files={files}
          setFiles={setFiles}
          inputRef={fileInputRef}
        />

        <div className="chat-input-wrapper">
          <input
            type="text"
            placeholder="Type a message..."
            value={content}
            onChange={handleInputChange}
            ref={inputRef}
          />

          {/* Action Buttons Grouped Inside Input */}
          <div className="input-actions-group">
            <button
              className="input-action-btn"
              type="button"
              onClick={() => setShowEmoji(!showEmoji)}
              title="Insert Emoji"
            >
              <FaIconWrapper icon={MdInsertEmoticon} size={22} />
            </button>

            <button
              className="input-action-btn"
              type="button"
              title="Attach File"
              onClick={handleAttachmentClick}
            >
              <FaIconWrapper icon={CgAttachment} size={22} />
            </button>

            <button
              className="input-action-btn send-btn"
              type="submit"
              title="Send"
            >
              <FaIconWrapper icon={CiPaperplane} size={20} />
            </button>
          </div>

          {/* Emoji Picker */}
          <EmojiPickerAttachment
            showEmoji={showEmoji}
            setShowEmoji={setShowEmoji}
            handleEmojiClick={handleEmojiClick}
          />
        </div>
      </form>
    </div>
  );
}

// Helper to avoid icon component typing issue in TSX
function FaIconWrapper({ icon: Icon, size }: { icon: any; size: number }) {
  return <Icon size={size} />;
}

export default ChatMessageFooter;
