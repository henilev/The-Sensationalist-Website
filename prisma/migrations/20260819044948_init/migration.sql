-- CreateEnum
CREATE TYPE "TypeTag" AS ENUM ('ISSUE', 'VOLUME', 'ESSAY', 'SHORT_STORY', 'LONG_STORY', 'RESEARCH', 'JOURNALISM', 'HOW_TO', 'PROJECT', 'DIARY', 'SERIES');

-- CreateEnum
CREATE TYPE "ContentTag" AS ENUM ('SATIRE', 'REVIEW', 'POETRY', 'FICTION', 'PROJECT', 'HOW_TO', 'VISUAL_ART', 'MUSIC', 'VIDEO', 'POLITICAL', 'ESSAY', 'SOCIAL', 'NEWS', 'CULTURE', 'COMPLAINT', 'LETTER', 'OPINION', 'COMMENTARY', 'THOUGHT', 'PHOTOGRAPHY');

-- CreateTable
CREATE TABLE "Publication" (
    "id" TEXT NOT NULL,
    "datePublished" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateEdited" TIMESTAMP(3) NOT NULL,
    "pdfUrl" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "typeTag" "TypeTag" NOT NULL,
    "contentTag" "ContentTag",
    "author" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pageLength" INTEGER NOT NULL,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "seriesTag" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Publication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "datePublished" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateEdited" TIMESTAMP(3) NOT NULL,
    "richTextBody" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "contentTag" "ContentTag",
    "author" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "seriesTag" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Update" (
    "id" TEXT NOT NULL,
    "datePublished" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateEdited" TIMESTAMP(3) NOT NULL,
    "richTextBody" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "author" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Update_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryImage" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Publication_typeTag_idx" ON "Publication"("typeTag");

-- CreateIndex
CREATE INDEX "Publication_contentTag_idx" ON "Publication"("contentTag");

-- CreateIndex
CREATE INDEX "Publication_pinned_idx" ON "Publication"("pinned");

-- CreateIndex
CREATE INDEX "Publication_datePublished_idx" ON "Publication"("datePublished");

-- CreateIndex
CREATE INDEX "BlogPost_contentTag_idx" ON "BlogPost"("contentTag");

-- CreateIndex
CREATE INDEX "BlogPost_pinned_idx" ON "BlogPost"("pinned");

-- CreateIndex
CREATE INDEX "BlogPost_datePublished_idx" ON "BlogPost"("datePublished");

-- CreateIndex
CREATE INDEX "Update_datePublished_idx" ON "Update"("datePublished");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_email_key" ON "Subscriber"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
