import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BlogForm } from "../blog-form";
import { updateBlogPost } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit Blog Post</h1>
      <div className="mt-6">
        <BlogForm action={updateBlogPost.bind(null, id)} post={post} />
      </div>
    </div>
  );
}
