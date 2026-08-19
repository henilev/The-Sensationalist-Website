"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { uploadPdf, uploadImage, deletePdf, deleteImage } from "@/lib/cloudinary";
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
  const pdf = await uploadPdf(Buffer.from(await pdfFile.arrayBuffer()), "publications/pdfs");

  let coverImageUrl: string | undefined;
  let coverImagePublicId: string | undefined;
  const coverFile = formData.get("coverImage") as File | null;
  if (coverFile && coverFile.size > 0) {
    const result = await uploadImage(Buffer.from(await coverFile.arrayBuffer()), "publications/covers");
    coverImageUrl = result.url;
    coverImagePublicId = result.publicId;
  }

  await prisma.publication.create({
    data: {
      ...fields,
      pdfUrl: pdf.url,
      pdfPublicId: pdf.publicId,
      coverImageUrl,
      coverImagePublicId,
    },
  });

  revalidatePublicationPaths();
  redirect("/admin/publications");
}

export async function updatePublication(id: string, formData: FormData) {
  const fields = readFields(formData);
  const existing = await prisma.publication.findUniqueOrThrow({ where: { id } });

  const pdfFile = formData.get("pdf") as File | null;
  let pdfUrl: string | undefined;
  let pdfPublicId: string | undefined;
  if (pdfFile && pdfFile.size > 0) {
    const pdf = await uploadPdf(Buffer.from(await pdfFile.arrayBuffer()), "publications/pdfs");
    pdfUrl = pdf.url;
    pdfPublicId = pdf.publicId;
    await deletePdf(existing.pdfPublicId);
  }

  const coverFile = formData.get("coverImage") as File | null;
  let coverImageUrl: string | undefined;
  let coverImagePublicId: string | undefined;
  if (coverFile && coverFile.size > 0) {
    const result = await uploadImage(Buffer.from(await coverFile.arrayBuffer()), "publications/covers");
    coverImageUrl = result.url;
    coverImagePublicId = result.publicId;
    await deleteImage(existing.coverImagePublicId);
  }

  await prisma.publication.update({
    where: { id },
    data: {
      ...fields,
      ...(pdfUrl && { pdfUrl, pdfPublicId }),
      ...(coverImageUrl && { coverImageUrl, coverImagePublicId }),
    },
  });

  revalidatePublicationPaths();
  redirect("/admin/publications");
}

export async function deletePublication(id: string) {
  const existing = await prisma.publication.findUniqueOrThrow({ where: { id } });
  await prisma.publication.delete({ where: { id } });
  await Promise.all([deletePdf(existing.pdfPublicId), deleteImage(existing.coverImagePublicId)]);
  revalidatePublicationPaths();
}
