import { getFileName, checkIsImage } from "@core/utils/chat.utils";

interface FileAttachmentProps {
  linkFile: string[];
}

function FileAttachment({ linkFile }: FileAttachmentProps) {
  return (
    <>
      {linkFile.map((image, imgIndex) => {
        if (!image) return null;
        const isImage = checkIsImage(image);

        if (isImage) {
          return (
            <img
              key={imgIndex}
              src={image}
              alt="preview"
              className="chat-image-preview"
            />
          );
        } else {
          return (
            <a
              key={imgIndex}
              href={image}
              target="_blank"
              rel="noreferrer"
              className="file-attachment-box"
            >
              <i className="bx bx-file"></i>
              <span className="file-name">{getFileName(image)}</span>
            </a>
          );
        }
      })}
    </>
  );
}

export default FileAttachment;
