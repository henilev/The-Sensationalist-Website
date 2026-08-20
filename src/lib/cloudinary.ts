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
  return uploadToCloudinary(fileBuffer, folder, "raw", "pdf");
}

export async function deleteImage(publicId: string | null | undefined) {
  return deleteAsset(publicId, "image");
}

export async function deletePdf(publicId: string | null | undefined) {
  return deleteAsset(publicId, "raw");
}

async function deleteAsset(publicId: string | null | undefined, resourceType: "image" | "raw") {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error(`Failed to delete Cloudinary asset ${publicId}:`, error);
  }
}

function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string,
  resourceType: "image" | "raw",
  format?: string,
) {
  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType, ...(format && { format }) },
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
