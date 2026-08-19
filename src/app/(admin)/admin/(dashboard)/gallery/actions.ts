"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { uploadImage, deleteImage } from "@/lib/cloudinary";

function revalidateGalleryPaths() {
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

export async function createGalleryImage(formData: FormData) {
  const imageFile = formData.get("image") as File | null;
  if (!imageFile || imageFile.size === 0) throw new Error("An image file is required.");

  const { url, publicId } = await uploadImage(Buffer.from(await imageFile.arrayBuffer()), "gallery");
  const caption = String(formData.get("caption") ?? "").trim() || null;
  const order = Number(formData.get("order") ?? 0) || 0;

  await prisma.galleryImage.create({
    data: { imageUrl: url, imagePublicId: publicId, caption, order },
  });

  revalidateGalleryPaths();
}

export async function deleteGalleryImage(id: string) {
  const existing = await prisma.galleryImage.findUniqueOrThrow({ where: { id } });
  await prisma.galleryImage.delete({ where: { id } });
  await deleteImage(existing.imagePublicId);
  revalidateGalleryPaths();
}
