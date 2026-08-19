import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatTag } from "@/lib/tags";

export const metadata = { title: "Publications | The Sensationalist" };

export default async function PublicationsPage() {
  const publications = await prisma.publication.findMany({
    orderBy: { datePublished: "desc" },
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <h1 className="font-display text-3xl font-bold">Publications</h1>
      <p className="mt-2 text-ink/60">Issues, volumes, and longer-form work as embedded PDFs.</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {publications.length === 0 && (
          <p className="text-sm italic text-ink/40">No publications yet.</p>
        )}
        {publications.map((pub) => (
          <article key={pub.id} className="overflow-hidden rounded border border-ink/10 bg-white">
            {pub.coverImageUrl && (
              <div className="relative aspect-[16/9]">
                <Image src={pub.coverImageUrl} alt={pub.title} fill className="object-cover" />
              </div>
            )}
            <div className="p-5">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-ink/50">
              <span className="rounded-full bg-navy/10 px-2 py-0.5 text-navy">
                {formatTag(pub.typeTag)}
              </span>
              {pub.contentTag && (
                <span className="rounded-full bg-burgundy/10 px-2 py-0.5 text-burgundy">
                  {formatTag(pub.contentTag)}
                </span>
              )}
              {pub.pinned && (
                <span className="rounded-full bg-gold/10 px-2 py-0.5 text-gold">Pinned</span>
              )}
            </div>
            <h2 className="mt-3 font-display text-lg font-bold leading-snug">{pub.title}</h2>
            <p className="mt-2 text-sm text-ink/70">{pub.description}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-ink/50">
              <span>{pub.author ?? "The Sensationalist"}</span>
              <span>{pub.pageLength} pages</span>
            </div>
            <a
              href={pub.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-semibold text-burgundy underline"
            >
              Read PDF &rarr;
            </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
