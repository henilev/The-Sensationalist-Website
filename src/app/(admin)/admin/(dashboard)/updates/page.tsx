import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteUpdate } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminUpdatesPage() {
  const updates = await prisma.update.findMany({ orderBy: { datePublished: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Updates</h1>
        <Link
          href="/admin/updates/new"
          className="rounded bg-navy px-4 py-2 text-sm font-semibold text-white"
        >
          New Update
        </Link>
      </div>

      <div className="mt-6 divide-y divide-ink/10 rounded border border-ink/10 bg-white">
        {updates.length === 0 && <p className="p-5 text-sm text-ink/50">No updates yet.</p>}
        {updates.map((update) => (
          <div key={update.id} className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="font-semibold">{update.title}</p>
              <p className="text-xs text-ink/50">By {update.author}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-sm">
              <Link href={`/admin/updates/${update.id}`} className="text-navy underline">
                Edit
              </Link>
              <form
                action={async () => {
                  "use server";
                  await deleteUpdate(update.id);
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
