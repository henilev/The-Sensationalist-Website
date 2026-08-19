import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatTag, isTypeTag, isContentTag } from "@/lib/tags";
import { CoverImage } from "@/components/cover-image";
import { ContentTagPills } from "@/components/content-tag-pills";
import { FilterBar } from "@/components/filter-bar";
import { parseParam, parseSort } from "@/lib/content-query";

export const metadata = { title: "Publications | The Sensationalist" };

export default async function PublicationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const search = parseParam(params.q);
  const typeTag = parseParam(params.type);
  const contentTag = parseParam(params.tag);
  const sort = parseSort(params.sort);

  const where: Prisma.PublicationWhereInput = {
    ...(typeTag && isTypeTag(typeTag) ? { typeTag } : {}),
    ...(contentTag && isContentTag(contentTag) ? { contentTags: { has: contentTag } } : {}),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const orderBy: Prisma.PublicationOrderByWithRelationInput =
    sort === "title"
      ? { title: "asc" }
      : sort === "length"
        ? { pageLength: "desc" }
        : sort === "views"
          ? { views: "desc" }
          : { datePublished: "desc" };

  const publications = await prisma.publication.findMany({ where, orderBy });

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <h1 className="font-display text-3xl font-bold">Publications</h1>
      <p className="mt-2 text-ink/60">Issues, volumes, and longer-form work as embedded PDFs.</p>

      <FilterBar
        action="/publications"
        search={search}
        sort={sort}
        typeTag={typeTag}
        contentTag={contentTag}
        showTypeTag
      />

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {publications.length === 0 && (
          <p className="text-sm italic text-ink/40">No publications match.</p>
        )}
        {publications.map((pub) => (
          <article key={pub.id} className="overflow-hidden rounded border border-ink/10 bg-white">
            <Link href={`/publications/${pub.id}`}>
              <CoverImage src={pub.coverImageUrl} alt={pub.title} />
            </Link>
            <div className="p-5">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-ink/50">
                <span className="rounded-full bg-navy/10 px-2 py-0.5 text-navy">
                  {formatTag(pub.typeTag)}
                </span>
                <ContentTagPills tags={pub.contentTags} />
                {pub.pinned && (
                  <span className="rounded-full bg-gold/10 px-2 py-0.5 text-gold">Pinned</span>
                )}
              </div>
              <Link href={`/publications/${pub.id}`}>
                <h2 className="mt-3 font-display text-lg font-bold leading-snug hover:underline">
                  {pub.title}
                </h2>
              </Link>
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
