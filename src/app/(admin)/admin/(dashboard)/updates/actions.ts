"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";

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
  const coverFile = formData.get("coverImage") as File | null;
  if (coverFile && coverFile.size > 0) {
    const result = await uploadImage(Buffer.from(await coverFile.arrayBuffer()), "updates/covers");
    coverImageUrl = result.url;
  }

  await prisma.update.create({ data: { ...fields, coverImageUrl } });

  revalidateUpdatePaths();
  redirect("/admin/updates");
}

export async function updateUpdate(id: string, formData: FormData) {
  const fields = readFields(formData);

  const coverFile = formData.get("coverImage") as File | null;
  const coverImageUrl = coverFile && coverFile.size > 0
    ? (await uploadImage(Buffer.from(await coverFile.arrayBuffer()), "updates/covers")).url
    : undefined;

  await prisma.update.update({
    where: { id },
    data: { ...fields, ...(coverImageUrl && { coverImageUrl }) },
  });

  revalidateUpdatePaths();
  redirect("/admin/updates");
}

export async function deleteUpdate(id: string) {
  await prisma.update.delete({ where: { id } });
  revalidateUpdatePaths();
}
