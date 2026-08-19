import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatTag } from "@/lib/tags";
import { CoverImage } from "@/components/cover-image";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id }, select: { title: true } });
  return { title: post ? `${post.title} | The Sensationalist` : "Not Found" };
}

export default async function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  await prisma.blogPost.update({ where: { id }, data: { views: { increment: 1 } } });

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-ink/50">
        {post.contentTag && (
          <span className="rounded-full bg-burgundy/10 px-2 py-0.5 text-burgundy">
            {formatTag(post.contentTag)}
          </span>
        )}
        {post.pinned && (
          <span className="rounded-full bg-gold/10 px-2 py-0.5 text-gold">Pinned</span>
        )}
      </div>

      <h1 className="mt-3 font-display text-3xl font-bold leading-tight">{post.title}</h1>
      <div className="mt-2 flex flex-wrap gap-x-3 text-sm text-ink/60">
        <span>By {post.author}</span>
        <span>&middot;</span>
        <span>{post.datePublished.toLocaleDateString()}</span>
      </div>

      <div className="mt-6 overflow-hidden rounded border border-ink/10">
        <CoverImage src={post.coverImageUrl} alt={post.title} />
      </div>

      <div
        className="prose prose-neutral mt-8 max-w-none [&_a]:text-burgundy [&_a]:underline [&_iframe]:mx-auto [&_iframe]:my-4 [&_iframe]:max-w-full"
        dangerouslySetInnerHTML={{ __html: post.richTextBody }}
      />
    </div>
  );
}
