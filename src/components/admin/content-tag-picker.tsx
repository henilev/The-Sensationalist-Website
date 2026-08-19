import type { ContentTag } from "@prisma/client";
import { CONTENT_TAGS, formatTag } from "@/lib/tags";

export function ContentTagPicker({ defaultValues }: { defaultValues?: ContentTag[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-1 rounded border border-ink/20 p-3 sm:grid-cols-3">
      {CONTENT_TAGS.map((tag) => (
        <label key={tag} className="flex items-center gap-2 text-sm font-normal">
          <input
            type="checkbox"
            name="contentTags"
            value={tag}
            defaultChecked={defaultValues?.includes(tag)}
          />
          {formatTag(tag)}
        </label>
      ))}
    </div>
  );
}
