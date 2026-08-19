import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(fileBuffer: Buffer, folder: string) {
  return uploadToCloudinary(fileBuffer, folder, "image");
}

export async function uploadPdf(fileBuffer: Buffer, folder: string) {
  return uploadToCloudinary(fileBuffer, folder, "raw");
}

function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string,
  resourceType: "image" | "raw",
) {
  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );
    uploadStream.end(fileBuffer);
  });
}

export { cloudinary };
