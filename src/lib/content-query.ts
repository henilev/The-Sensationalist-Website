export type SortOption = "recency" | "title" | "length" | "views";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recency", label: "Most Recent" },
  { value: "title", label: "Title (A–Z)" },
  { value: "length", label: "Length" },
  { value: "views", label: "Most Viewed" },
];

export function parseSort(value: string | string[] | undefined): SortOption {
  const v = Array.isArray(value) ? value[0] : value;
  return v === "title" || v === "length" || v === "views" ? v : "recency";
}

export function parseParam(value: string | string[] | undefined): string {
  const v = Array.isArray(value) ? value[0] : value;
  return (v ?? "").trim();
}
