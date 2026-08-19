import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isContentTag } from "@/lib/tags";
import { CoverImage } from "@/components/cover-image";
import { ContentTagPills } from "@/components/content-tag-pills";
import { FilterBar } from "@/components/filter-bar";
import { parseParam, parseSort } from "@/lib/content-query";
import { wordCount } from "@/lib/word-count";

export const metadata = { title: "Blog | The Sensationalist" };

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const search = parseParam(params.q);
  const contentTag = parseParam(params.tag);
  const sort = parseSort(params.sort);

  const where: Prisma.BlogPostWhereInput = {
    ...(contentTag && isContentTag(contentTag) ? { contentTags: { has: contentTag } } : {}),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  // "length" has no DB column for blog posts (word count is computed from
  // the rich text body), so that one sort mode is applied in memory below.
  const orderBy: Prisma.BlogPostOrderByWithRelationInput =
    sort === "title"
      ? { title: "asc" }
      : sort === "views"
        ? { views: "desc" }
        : { datePublished: "desc" };

  let posts = await prisma.blogPost.findMany({ where, orderBy });
  if (sort === "length") {
    posts = [...posts].sort((a, b) => wordCount(b.richTextBody) - wordCount(a.richTextBody));
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <h1 className="font-display text-3xl font-bold">Blog</h1>
      <p className="mt-2 text-ink/60">
        Rich text posts, notes, and short pieces from The Sensationalist.
      </p>

      <FilterBar
        action="/blog"
        search={search}
        sort={sort}
        contentTag={contentTag}
        showTypeTag={false}
      />

      <div className="mt-8 flex flex-col divide-y divide-ink/10">
        {posts.length === 0 && (
          <p className="py-8 text-sm italic text-ink/40">No blog posts match.</p>
        )}
        {posts.map((post) => (
          <article key={post.id} className="flex flex-col gap-4 py-8 sm:flex-row">
            {post.coverImageUrl && (
              <Link href={`/blog/${post.id}`} className="w-full shrink-0 overflow-hidden rounded sm:w-56">
                <CoverImage src={post.coverImageUrl} alt={post.title} aspect="aspect-[4/3]" />
              </Link>
            )}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-ink/50">
                <span>{post.datePublished.toLocaleDateString()}</span>
                <ContentTagPills tags={post.contentTags} />
                {post.pinned && (
                  <span className="rounded-full bg-gold/10 px-2 py-0.5 text-gold">Pinned</span>
                )}
              </div>
              <Link href={`/blog/${post.id}`}>
                <h2 className="mt-2 font-display text-2xl font-bold leading-snug hover:underline">
                  {post.title}
                </h2>
              </Link>
              {post.description && <p className="mt-2 text-ink/70">{post.description}</p>}
              <p className="mt-3 text-sm text-ink/50">By {post.author}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
