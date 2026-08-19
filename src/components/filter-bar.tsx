import { TYPE_TAGS, CONTENT_TAGS, formatTag } from "@/lib/tags";
import { SORT_OPTIONS, type SortOption } from "@/lib/content-query";

export function FilterBar({
  action,
  search,
  sort,
  typeTag,
  contentTag,
  showTypeTag,
}: {
  action: string;
  search: string;
  sort: SortOption;
  typeTag?: string;
  contentTag: string;
  showTypeTag: boolean;
}) {
  return (
    <form
      method="GET"
      action={action}
      className="mt-8 flex flex-wrap items-end gap-3 rounded border border-ink/10 bg-white p-4"
    >
      <label className="text-sm">
        <span className="block text-xs font-medium uppercase tracking-wide text-ink/50">
          Search
        </span>
        <input
          type="text"
          name="q"
          defaultValue={search}
          placeholder="Title, description, author..."
          className="mt-1 w-56 rounded border border-ink/20 px-3 py-1.5 text-sm"
        />
      </label>

      {showTypeTag && (
        <label className="text-sm">
          <span className="block text-xs font-medium uppercase tracking-wide text-ink/50">
            Type
          </span>
          <select
            name="type"
            defaultValue={typeTag}
            className="mt-1 rounded border border-ink/20 px-3 py-1.5 text-sm"
          >
            <option value="">All</option>
            {TYPE_TAGS.map((tag) => (
              <option key={tag} value={tag}>
                {formatTag(tag)}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="text-sm">
        <span className="block text-xs font-medium uppercase tracking-wide text-ink/50">Tag</span>
        <select
          name="tag"
          defaultValue={contentTag}
          className="mt-1 rounded border border-ink/20 px-3 py-1.5 text-sm"
        >
          <option value="">All</option>
          {CONTENT_TAGS.map((tag) => (
            <option key={tag} value={tag}>
              {formatTag(tag)}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm">
        <span className="block text-xs font-medium uppercase tracking-wide text-ink/50">
          Sort by
        </span>
        <select
          name="sort"
          defaultValue={sort}
          className="mt-1 rounded border border-ink/20 px-3 py-1.5 text-sm"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        className="rounded bg-navy px-4 py-1.5 text-sm font-semibold text-white"
      >
        Apply
      </button>
      {(search || typeTag || contentTag || sort !== "recency") && (
        <a href={action} className="text-sm text-ink/50 underline">
          Reset
        </a>
      )}
    </form>
  );
}
