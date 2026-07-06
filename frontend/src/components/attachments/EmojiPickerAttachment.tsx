import { useRef, useEffect } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface EmojiPickerAttachmentProps {
  showEmoji: boolean;
  setShowEmoji: (show: boolean) => void;
  handleEmojiClick: (emojiData: EmojiClickData, event: MouseEvent) => void;
}

function EmojiPickerAttachment({ showEmoji, setShowEmoji, handleEmojiClick }: EmojiPickerAttachmentProps) {
  const emojiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowEmoji]);

  return (
    <>
      <div className="emoji-wrapper" ref={emojiRef}>
        {showEmoji && (
          <div className="emoji-picker-container">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              width={300}
              height={400}
              searchDisabled={true}
              skinTonesDisabled={true}
              previewConfig={{
                showPreview: false,
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default EmojiPickerAttachment;
