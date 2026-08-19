import { prisma } from "@/lib/prisma";
import { formatTag } from "@/lib/tags";

export const metadata = { title: "Blog | The Sensationalist" };

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { datePublished: "desc" } });

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <h1 className="font-display text-3xl font-bold">Blog</h1>
      <p className="mt-2 text-ink/60">
        Rich text posts, notes, and short pieces from The Sensationalist.
      </p>

      <div className="mt-10 flex flex-col divide-y divide-ink/10">
        {posts.length === 0 && (
          <p className="py-8 text-sm italic text-ink/40">No blog posts yet.</p>
        )}
        {posts.map((post) => (
          <article key={post.id} className="py-8">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-ink/50">
              <span>{post.datePublished.toLocaleDateString()}</span>
              {post.contentTag && (
                <span className="rounded-full bg-burgundy/10 px-2 py-0.5 text-burgundy">
                  {formatTag(post.contentTag)}
                </span>
              )}
              {post.pinned && (
                <span className="rounded-full bg-gold/10 px-2 py-0.5 text-gold">Pinned</span>
              )}
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold leading-snug">{post.title}</h2>
            {post.description && (
              <p className="mt-2 text-ink/70">{post.description}</p>
            )}
            <p className="mt-3 text-sm text-ink/50">By {post.author}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
