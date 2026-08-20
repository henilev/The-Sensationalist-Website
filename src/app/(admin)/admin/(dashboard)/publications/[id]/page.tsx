import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PublicationForm } from "../publication-form";
import { updatePublication } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditPublicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const publication = await prisma.publication.findUnique({ where: { id } });
  if (!publication) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit Publication</h1>
      <div className="mt-6">
        <PublicationForm action={updatePublication.bind(null, id)} publication={publication} />
      </div>
    </div>
  );
}
