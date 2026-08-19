import type { Publication } from "@prisma/client";
import { TYPE_TAGS, formatTag } from "@/lib/tags";
import { Field } from "@/components/admin/field";
import { ContentTagPicker } from "@/components/admin/content-tag-picker";

export function PublicationForm({
  action,
  publication,
}: {
  action: (formData: FormData) => void;
  publication?: Publication;
}) {
  return (
    <form action={action} className="max-w-2xl space-y-5">
      <Field label="Title">
        <input
          name="title"
          required
          defaultValue={publication?.title}
          className="w-full rounded border border-ink/20 px-3 py-2 text-sm"
        />
      </Field>

      <Field label="Description">
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={publication?.description}
          className="w-full rounded border border-ink/20 px-3 py-2 text-sm"
        />
      </Field>

      <Field label="Type Tag">
        <select
          name="typeTag"
          required
          defaultValue={publication?.typeTag ?? ""}
          className="w-full max-w-xs rounded border border-ink/20 px-3 py-2 text-sm"
        >
          <option value="" disabled>
            Select...
          </option>
          {TYPE_TAGS.map((tag) => (
            <option key={tag} value={tag}>
              {formatTag(tag)}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Content Tags (optional, choose any that apply)">
        <ContentTagPicker defaultValues={publication?.contentTags} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Author (optional)">
          <input
            name="author"
            defaultValue={publication?.author ?? ""}
            className="w-full rounded border border-ink/20 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Page Length">
          <input
            name="pageLength"
            type="number"
            min={1}
            required
            defaultValue={publication?.pageLength}
            className="w-full rounded border border-ink/20 px-3 py-2 text-sm"
          />
        </Field>
      </div>

      <Field label="Series/Article Name Tag (optional)">
        <input
          name="seriesTag"
          defaultValue={publication?.seriesTag ?? ""}
          placeholder="e.g. Afterlives, Part 2"
          className="w-full rounded border border-ink/20 px-3 py-2 text-sm"
        />
      </Field>

      <Field label={publication ? "Replace PDF (optional)" : "PDF"}>
        <input
          name="pdf"
          type="file"
          accept="application/pdf"
          required={!publication}
          className="w-full text-sm"
        />
        {publication && (
          <p className="mt-1 text-xs text-ink/50">
            Leave blank to keep the current PDF.
          </p>
        )}
      </Field>

      <Field label="Cover Image (optional)">
        <input name="coverImage" type="file" accept="image/*" className="w-full text-sm" />
        {publication?.coverImageUrl && (
          <p className="mt-1 text-xs text-ink/50">Leave blank to keep the current cover image.</p>
        )}
      </Field>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="pinned" defaultChecked={publication?.pinned} />
        Pinned on Home page
      </label>

      <button
        type="submit"
        className="rounded bg-navy px-5 py-2 text-sm font-semibold text-white"
      >
        {publication ? "Save Changes" : "Publish"}
      </button>
    </form>
  );
}
