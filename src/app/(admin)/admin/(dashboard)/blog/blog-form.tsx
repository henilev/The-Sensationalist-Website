import type { BlogPost } from "@prisma/client";
import { CONTENT_TAGS, formatTag } from "@/lib/tags";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

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

      <div className="grid grid-cols-2 gap-4">
        <Field label="Author">
          <input
            name="author"
            required
            defaultValue={post?.author}
            className="w-full rounded border border-ink/20 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Content Tag (optional)">
          <select
            name="contentTag"
            defaultValue={post?.contentTag ?? ""}
            className="w-full rounded border border-ink/20 px-3 py-2 text-sm"
          >
            <option value="">None</option>
            {CONTENT_TAGS.map((tag) => (
              <option key={tag} value={tag}>
                {formatTag(tag)}
              </option>
            ))}
          </select>
        </Field>
      </div>

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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}
