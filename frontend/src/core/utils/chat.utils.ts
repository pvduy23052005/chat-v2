// convert time .
export const formatTime = (dateString?: string | Date): string => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const checkIsImage = (url?: string): boolean => {
  if (!url) return false;
  return /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
};

export const getFileName = (url?: string): string => {
  if (!url) return "File";
  const parts = url.split("/");
  const lastPart = parts[parts.length - 1];
  if (!lastPart) return "File";
  return lastPart.split("?")[0]?.split(":upload:")[0] || "File";
};

export const isSystemMessage = (content?: string): boolean => {
  return !!(
    content?.includes("đã rời nhóm") ||
    content?.includes("đã thêm") ||
    content?.includes("đã xóa")
  );
};
