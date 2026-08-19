-- Publication: contentTag (single, nullable) -> contentTags (array), preserving existing values
ALTER TABLE "Publication" ADD COLUMN "contentTags" "ContentTag"[] NOT NULL DEFAULT ARRAY[]::"ContentTag"[];
UPDATE "Publication" SET "contentTags" = ARRAY["contentTag"] WHERE "contentTag" IS NOT NULL;
DROP INDEX IF EXISTS "Publication_contentTag_idx";
ALTER TABLE "Publication" DROP COLUMN "contentTag";

-- BlogPost: contentTag (single, nullable) -> contentTags (array), preserving existing values
ALTER TABLE "BlogPost" ADD COLUMN "contentTags" "ContentTag"[] NOT NULL DEFAULT ARRAY[]::"ContentTag"[];
UPDATE "BlogPost" SET "contentTags" = ARRAY["contentTag"] WHERE "contentTag" IS NOT NULL;
DROP INDEX IF EXISTS "BlogPost_contentTag_idx";
ALTER TABLE "BlogPost" DROP COLUMN "contentTag";
