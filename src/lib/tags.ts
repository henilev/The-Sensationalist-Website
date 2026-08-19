import type { TypeTag, ContentTag } from "@prisma/client";

export function formatTag(tag: string): string {
  return tag
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const TYPE_TAGS: TypeTag[] = [
  "ISSUE",
  "VOLUME",
  "ESSAY",
  "SHORT_STORY",
  "LONG_STORY",
  "RESEARCH",
  "JOURNALISM",
  "HOW_TO",
  "PROJECT",
  "DIARY",
  "SERIES",
];

export const CONTENT_TAGS: ContentTag[] = [
  "SATIRE",
  "REVIEW",
  "POETRY",
  "FICTION",
  "PROJECT",
  "HOW_TO",
  "VISUAL_ART",
  "MUSIC",
  "VIDEO",
  "POLITICAL",
  "ESSAY",
  "SOCIAL",
  "NEWS",
  "CULTURE",
  "COMPLAINT",
  "LETTER",
  "OPINION",
  "COMMENTARY",
  "THOUGHT",
  "PHOTOGRAPHY",
];

export function isTypeTag(value: string): value is TypeTag {
  return (TYPE_TAGS as string[]).includes(value);
}

export function isContentTag(value: string): value is ContentTag {
  return (CONTENT_TAGS as string[]).includes(value);
}
