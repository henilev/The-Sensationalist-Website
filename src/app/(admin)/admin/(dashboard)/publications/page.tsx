import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatTag } from "@/lib/tags";
import { deletePublication } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPublicationsPage() {
  const publications = await prisma.publication.findMany({ orderBy: { datePublished: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Publications</h1>
        <Link
          href="/admin/publications/new"
          className="rounded bg-navy px-4 py-2 text-sm font-semibold text-white"
        >
          New Publication
        </Link>
      </div>

      <div className="mt-6 divide-y divide-ink/10 rounded border border-ink/10 bg-white">
        {publications.length === 0 && (
          <p className="p-5 text-sm text-ink/50">No publications yet.</p>
        )}
        {publications.map((pub) => (
          <div key={pub.id} className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="font-semibold">{pub.title}</p>
              <p className="text-xs text-ink/50">
                {formatTag(pub.typeTag)} &middot; {pub.views} views
                {pub.pinned && " · Pinned"}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-sm">
              <Link href={`/admin/publications/${pub.id}`} className="text-navy underline">
                Edit
              </Link>
              <form
                action={async () => {
                  "use server";
                  await deletePublication(pub.id);
                }}
              >
                <button type="submit" className="text-burgundy underline">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
