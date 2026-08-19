"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";
import type { ContentTag } from "@prisma/client";
import { isContentTag } from "@/lib/tags";

function readFields(formData: FormData) {
  const contentTagRaw = String(formData.get("contentTag") ?? "");
  if (contentTagRaw && !isContentTag(contentTagRaw)) throw new Error("Invalid content tag");

  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    richTextBody: String(formData.get("richTextBody") ?? ""),
    author: String(formData.get("author") ?? "").trim(),
    contentTag: (contentTagRaw || null) as ContentTag | null,
    seriesTag: String(formData.get("seriesTag") ?? "").trim() || null,
    pinned: formData.get("pinned") === "on",
  } as const;
}

function revalidateBlogPaths() {
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/");
}

export async function createBlogPost(formData: FormData) {
  const fields = readFields(formData);
  if (!fields.title || !fields.author || !fields.richTextBody) {
    throw new Error("Title, author, and body are required.");
  }

  let coverImageUrl: string | undefined;
  const coverFile = formData.get("coverImage") as File | null;
  if (coverFile && coverFile.size > 0) {
    const result = await uploadImage(Buffer.from(await coverFile.arrayBuffer()), "blog/covers");
    coverImageUrl = result.url;
  }

  await prisma.blogPost.create({ data: { ...fields, coverImageUrl } });

  revalidateBlogPaths();
  redirect("/admin/blog");
}

export async function updateBlogPost(id: string, formData: FormData) {
  const fields = readFields(formData);

  const coverFile = formData.get("coverImage") as File | null;
  const coverImageUrl = coverFile && coverFile.size > 0
    ? (await uploadImage(Buffer.from(await coverFile.arrayBuffer()), "blog/covers")).url
    : undefined;

  await prisma.blogPost.update({
    where: { id },
    data: { ...fields, ...(coverImageUrl && { coverImageUrl }) },
  });

  revalidateBlogPaths();
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string) {
  await prisma.blogPost.delete({ where: { id } });
  revalidateBlogPaths();
}
