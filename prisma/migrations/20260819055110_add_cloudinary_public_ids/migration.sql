-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "coverImagePublicId" TEXT;

-- AlterTable
ALTER TABLE "GalleryImage" ADD COLUMN     "imagePublicId" TEXT;

-- AlterTable
ALTER TABLE "Publication" ADD COLUMN     "coverImagePublicId" TEXT,
ADD COLUMN     "pdfPublicId" TEXT;

-- AlterTable
ALTER TABLE "Update" ADD COLUMN     "coverImagePublicId" TEXT;
