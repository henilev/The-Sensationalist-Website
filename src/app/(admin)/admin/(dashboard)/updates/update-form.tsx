import type { Update } from "@prisma/client";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

export function UpdateForm({
  action,
  update,
}: {
  action: (formData: FormData) => void;
  update?: Update;
}) {
  return (
    <form action={action} className="max-w-2xl space-y-5">
      <Field label="Title">
        <input
          name="title"
          required
          defaultValue={update?.title}
          className="w-full rounded border border-ink/20 px-3 py-2 text-sm"
        />
      </Field>

      <Field label="Body">
        <RichTextEditor name="richTextBody" defaultValue={update?.richTextBody} />
      </Field>

      <Field label="Author">
        <input
          name="author"
          required
          defaultValue={update?.author}
          className="w-full rounded border border-ink/20 px-3 py-2 text-sm"
        />
      </Field>

      <Field label="Cover Image (optional)">
        <input name="coverImage" type="file" accept="image/*" className="w-full text-sm" />
        {update?.coverImageUrl && (
          <p className="mt-1 text-xs text-ink/50">Leave blank to keep the current cover image.</p>
        )}
      </Field>

      <button type="submit" className="rounded bg-navy px-5 py-2 text-sm font-semibold text-white">
        {update ? "Save Changes" : "Publish"}
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
