import type { ContentTag } from "@prisma/client";
import { formatTag } from "@/lib/tags";

export function ContentTagPills({ tags }: { tags: ContentTag[] }) {
  return (
    <>
      {tags.map((tag) => (
        <span key={tag} className="rounded-full bg-burgundy/10 px-2 py-0.5 text-burgundy">
          {formatTag(tag)}
        </span>
      ))}
    </>
  );
}
