"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { uploadPdf, uploadImage } from "@/lib/cloudinary";
import type { TypeTag, ContentTag } from "@prisma/client";
import { isTypeTag, isContentTag } from "@/lib/tags";

function readFields(formData: FormData) {
  const typeTag = String(formData.get("typeTag"));
  const contentTagRaw = String(formData.get("contentTag") ?? "");
  if (!isTypeTag(typeTag)) throw new Error("Invalid type tag");
  if (contentTagRaw && !isContentTag(contentTagRaw)) throw new Error("Invalid content tag");

  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    pageLength: Number(formData.get("pageLength")),
    typeTag: typeTag as TypeTag,
    contentTag: (contentTagRaw || null) as ContentTag | null,
    author: String(formData.get("author") ?? "").trim() || null,
    seriesTag: String(formData.get("seriesTag") ?? "").trim() || null,
    pinned: formData.get("pinned") === "on",
  } as const;
}

function revalidatePublicationPaths() {
  revalidatePath("/admin/publications");
  revalidatePath("/publications");
  revalidatePath("/");
}

export async function createPublication(formData: FormData) {
  const fields = readFields(formData);

  const pdfFile = formData.get("pdf") as File | null;
  if (!pdfFile || pdfFile.size === 0) throw new Error("A PDF file is required.");
  const { url: pdfUrl } = await uploadPdf(Buffer.from(await pdfFile.arrayBuffer()), "publications/pdfs");

  let coverImageUrl: string | undefined;
  const coverFile = formData.get("coverImage") as File | null;
  if (coverFile && coverFile.size > 0) {
    const result = await uploadImage(Buffer.from(await coverFile.arrayBuffer()), "publications/covers");
    coverImageUrl = result.url;
  }

  await prisma.publication.create({ data: { ...fields, pdfUrl, coverImageUrl } });

  revalidatePublicationPaths();
  redirect("/admin/publications");
}

export async function updatePublication(id: string, formData: FormData) {
  const fields = readFields(formData);

  const pdfFile = formData.get("pdf") as File | null;
  const pdfUrl = pdfFile && pdfFile.size > 0
    ? (await uploadPdf(Buffer.from(await pdfFile.arrayBuffer()), "publications/pdfs")).url
    : undefined;

  const coverFile = formData.get("coverImage") as File | null;
  const coverImageUrl = coverFile && coverFile.size > 0
    ? (await uploadImage(Buffer.from(await coverFile.arrayBuffer()), "publications/covers")).url
    : undefined;

  await prisma.publication.update({
    where: { id },
    data: { ...fields, ...(pdfUrl && { pdfUrl }), ...(coverImageUrl && { coverImageUrl }) },
  });

  revalidatePublicationPaths();
  redirect("/admin/publications");
}

export async function deletePublication(id: string) {
  await prisma.publication.delete({ where: { id } });
  revalidatePublicationPaths();
}
