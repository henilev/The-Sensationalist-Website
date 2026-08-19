import type { BlogPost } from "@prisma/client";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Field } from "@/components/admin/field";
import { ContentTagPicker } from "@/components/admin/content-tag-picker";

export function BlogForm({
  action,
  post,
}: {
  action: (formData: FormData) => void;
  post?: BlogPost;
}) {
  return (
    <form action={action} className="max-w-2xl space-y-5">
      <Field label="Title">
        <input
          name="title"
          required
          defaultValue={post?.title}
          className="w-full rounded border border-ink/20 px-3 py-2 text-sm"
        />
      </Field>

      <Field label="Description (optional)">
        <textarea
          name="description"
          rows={2}
          defaultValue={post?.description ?? ""}
          className="w-full rounded border border-ink/20 px-3 py-2 text-sm"
        />
      </Field>

      <Field label="Body">
        <RichTextEditor name="richTextBody" defaultValue={post?.richTextBody} />
      </Field>

      <Field label="Author">
        <input
          name="author"
          required
          defaultValue={post?.author}
          className="w-full max-w-xs rounded border border-ink/20 px-3 py-2 text-sm"
        />
      </Field>

      <Field label="Content Tags (optional, choose any that apply)">
        <ContentTagPicker defaultValues={post?.contentTags} />
      </Field>

      <Field label="Series/Article Name Tag (optional)">
        <input
          name="seriesTag"
          defaultValue={post?.seriesTag ?? ""}
          className="w-full rounded border border-ink/20 px-3 py-2 text-sm"
        />
      </Field>

      <Field label="Cover Image (optional)">
        <input name="coverImage" type="file" accept="image/*" className="w-full text-sm" />
        {post?.coverImageUrl && (
          <p className="mt-1 text-xs text-ink/50">Leave blank to keep the current cover image.</p>
        )}
      </Field>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="pinned" defaultChecked={post?.pinned} />
        Pinned on Home page
      </label>

      <button type="submit" className="rounded bg-navy px-5 py-2 text-sm font-semibold text-white">
        {post ? "Save Changes" : "Publish"}
      </button>
    </form>
  );
}
