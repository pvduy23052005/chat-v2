import { API } from "@core/api/api";

export interface FileObject {
  original: File;
}

export const uploadFile = async (files: FileObject[]): Promise<string[]> => {
  const formData = new FormData();

  if (!files || files.length === 0) {
    return [];
  }

  files.forEach((file) => {
    formData.append("images", file.original);
  });

  try {
    const res = await API.post("/upload/files", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data?.urls || [];
  } catch (error) {
    console.log(error);
    return [];
  }
};
