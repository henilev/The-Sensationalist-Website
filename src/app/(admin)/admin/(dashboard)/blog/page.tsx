import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteBlogPost } from "./actions";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { datePublished: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          className="rounded bg-navy px-4 py-2 text-sm font-semibold text-white"
        >
          New Blog Post
        </Link>
      </div>

      <div className="mt-6 divide-y divide-ink/10 rounded border border-ink/10 bg-white">
        {posts.length === 0 && <p className="p-5 text-sm text-ink/50">No blog posts yet.</p>}
        {posts.map((post) => (
          <div key={post.id} className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="font-semibold">{post.title}</p>
              <p className="text-xs text-ink/50">
                By {post.author}
                {post.pinned && " · Pinned"}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-sm">
              <Link href={`/admin/blog/${post.id}`} className="text-navy underline">
                Edit
              </Link>
              <form
                action={async () => {
                  "use server";
                  await deleteBlogPost(post.id);
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
