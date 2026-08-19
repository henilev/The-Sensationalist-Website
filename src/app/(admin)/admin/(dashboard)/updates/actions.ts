"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { uploadImage, deleteImage } from "@/lib/cloudinary";

function readFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    richTextBody: String(formData.get("richTextBody") ?? ""),
    author: String(formData.get("author") ?? "").trim(),
  } as const;
}

function revalidateUpdatePaths() {
  revalidatePath("/admin/updates");
  revalidatePath("/");
}

export async function createUpdate(formData: FormData) {
  const fields = readFields(formData);
  if (!fields.title || !fields.author || !fields.richTextBody) {
    throw new Error("Title, author, and body are required.");
  }

  let coverImageUrl: string | undefined;
  let coverImagePublicId: string | undefined;
  const coverFile = formData.get("coverImage") as File | null;
  if (coverFile && coverFile.size > 0) {
    const result = await uploadImage(Buffer.from(await coverFile.arrayBuffer()), "updates/covers");
    coverImageUrl = result.url;
    coverImagePublicId = result.publicId;
  }

  await prisma.update.create({ data: { ...fields, coverImageUrl, coverImagePublicId } });

  revalidateUpdatePaths();
  redirect("/admin/updates");
}

export async function updateUpdate(id: string, formData: FormData) {
  const fields = readFields(formData);
  const existing = await prisma.update.findUniqueOrThrow({ where: { id } });

  const coverFile = formData.get("coverImage") as File | null;
  let coverImageUrl: string | undefined;
  let coverImagePublicId: string | undefined;
  if (coverFile && coverFile.size > 0) {
    const result = await uploadImage(Buffer.from(await coverFile.arrayBuffer()), "updates/covers");
    coverImageUrl = result.url;
    coverImagePublicId = result.publicId;
    await deleteImage(existing.coverImagePublicId);
  }

  await prisma.update.update({
    where: { id },
    data: { ...fields, ...(coverImageUrl && { coverImageUrl, coverImagePublicId }) },
  });

  revalidateUpdatePaths();
  redirect("/admin/updates");
}

export async function deleteUpdate(id: string) {
  const existing = await prisma.update.findUniqueOrThrow({ where: { id } });
  await prisma.update.delete({ where: { id } });
  await deleteImage(existing.coverImagePublicId);
  revalidateUpdatePaths();
}
