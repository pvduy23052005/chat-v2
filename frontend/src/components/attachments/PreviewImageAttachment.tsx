import { useEffect } from "react";
import "../../styles/components/attachments/previewImage.css";
import FilePreview from "reactjs-file-preview";
import { TiDelete } from "react-icons/ti";

export interface PreviewFile {
  original: File;
  preview: string;
}

interface PreviewImageProps {
  files: PreviewFile[];
  setFiles: React.Dispatch<React.SetStateAction<PreviewFile[]>>;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

function PreviewImage({ files, setFiles, inputRef }: PreviewImageProps) {
  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files).map((file) => ({
        original: file,
        preview: URL.createObjectURL(file),
      }));
      console.log(selectedFiles);
      setFiles((prev) => [...prev, ...selectedFiles]);
      e.target.value = ""; // Reset input
    }
  };

  const onRemove = (index: number, fileItem: PreviewFile) => {
    URL.revokeObjectURL(fileItem.preview);
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => files.forEach((f) => URL.revokeObjectURL(f.preview));
  }, [files]);

  return (
    <>
      <input
        type="file"
        multiple
        hidden
        ref={inputRef}
        onChange={onFileSelect}
      />

      {files.length > 0 && (
        <div className="preview-list">
          {files.map((item, index) => (
            <div key={index} className="preview-item">
              <div
                className="btn-remove-file"
                onClick={() => onRemove(index, item)}
              >
                <TiDelete />
              </div>
              <div className="preview-content-wrapper">
                <FilePreview
                  preview={item.preview} // Dùng link Blob URL
                  placeHolderImage="https://placehold.co/600x400/fff/000?text=Placeholder"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default PreviewImage;
