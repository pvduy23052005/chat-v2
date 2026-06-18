import cloudinary from "../config/cloudinary";

export const uploadFile = async (files: any): Promise<string[]> => {
  try {
    if (!files || files.length === 0) return [];

    const upload = files.map((file: any) => {
      return new Promise<string>((resolve, reject) => {

        const originalName = file.originalname || "file_upload";

        const cleanFileName = originalName
          .split(".")[0]
          .replace(/\s+/g, '_');

        const isImage = file.mimetype.startsWith("image");

        const resourceType = isImage ? "image" : "raw";

        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "products",
            resource_type: resourceType,
            filename_override: cleanFileName,
            use_filename: true,
            unique_filename: false,
            transformation: [
              { width: 150, height: 150, crop: "fill", gravity: "center" }
            ],
          },
          (error, result) => {
            if (error) return reject(error);
            if (result) return resolve(result.secure_url);
            resolve("");
          }
        );

        stream.end(file.buffer);
      });
    });

    const fileUrls = await Promise.all(upload);
    return fileUrls;

  } catch (error) {
    console.log("Upload failed:", error);
    return [];
  }
};
