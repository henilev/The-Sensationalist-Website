import { BlogForm } from "../blog-form";
import { createBlogPost } from "../actions";

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">New Blog Post</h1>
      <div className="mt-6">
        <BlogForm action={createBlogPost} />
      </div>
    </div>
  );
}
