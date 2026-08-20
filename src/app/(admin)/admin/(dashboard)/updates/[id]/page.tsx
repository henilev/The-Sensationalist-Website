import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UpdateForm } from "../update-form";
import { updateUpdate } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const update = await prisma.update.findUnique({ where: { id } });
  if (!update) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit Update</h1>
      <div className="mt-6">
        <UpdateForm action={updateUpdate.bind(null, id)} update={update} />
      </div>
    </div>
  );
}
