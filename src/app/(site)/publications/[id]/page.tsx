import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatTag } from "@/lib/tags";
import { CoverImage } from "@/components/cover-image";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const publication = await prisma.publication.findUnique({ where: { id }, select: { title: true } });
  return { title: publication ? `${publication.title} | The Sensationalist` : "Not Found" };
}

export default async function PublicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const publication = await prisma.publication.findUnique({ where: { id } });
  if (!publication) notFound();

  await prisma.publication.update({ where: { id }, data: { views: { increment: 1 } } });

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-ink/50">
        <span className="rounded-full bg-navy/10 px-2 py-0.5 text-navy">
          {formatTag(publication.typeTag)}
        </span>
        {publication.contentTag && (
          <span className="rounded-full bg-burgundy/10 px-2 py-0.5 text-burgundy">
            {formatTag(publication.contentTag)}
          </span>
        )}
        {publication.pinned && (
          <span className="rounded-full bg-gold/10 px-2 py-0.5 text-gold">Pinned</span>
        )}
      </div>

      <h1 className="mt-3 font-display text-3xl font-bold leading-tight">{publication.title}</h1>
      <div className="mt-2 flex flex-wrap gap-x-3 text-sm text-ink/60">
        <span>{publication.author ?? "The Sensationalist"}</span>
        <span>&middot;</span>
        <span>{publication.datePublished.toLocaleDateString()}</span>
        <span>&middot;</span>
        <span>{publication.pageLength} pages</span>
      </div>

      <div className="mt-6 overflow-hidden rounded border border-ink/10">
        <CoverImage src={publication.coverImageUrl} alt={publication.title} />
      </div>

      <p className="mt-6 text-ink/80">{publication.description}</p>

      <div className="mt-8">
        <a
          href={publication.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-burgundy underline"
        >
          Open PDF in a new tab &rarr;
        </a>
        <div className="mt-3 overflow-hidden rounded border border-ink/10">
          <iframe src={publication.pdfUrl} className="h-[80vh] w-full" title={publication.title} />
        </div>
      </div>
    </div>
  );
}
