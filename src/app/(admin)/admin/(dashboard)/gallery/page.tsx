import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { createGalleryImage, deleteGalleryImage } from "./actions";

export default async function AdminGalleryPage() {
  const images = await prisma.galleryImage.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold">Photo Gallery</h1>
      <p className="mt-1 text-sm text-ink/60">
        Curated images shown in the Home page gallery, separate from post cover images.
      </p>

      <form
        action={createGalleryImage}
        className="mt-6 flex max-w-xl flex-wrap items-end gap-4 rounded border border-ink/10 bg-white p-4"
      >
        <label className="text-sm font-medium">
          Image
          <input name="image" type="file" accept="image/*" required className="mt-1 block text-sm" />
        </label>
        <label className="text-sm font-medium">
          Caption (optional)
          <input name="caption" className="mt-1 block rounded border border-ink/20 px-3 py-2 text-sm" />
        </label>
        <label className="text-sm font-medium">
          Order
          <input
            name="order"
            type="number"
            defaultValue={images.length}
            className="mt-1 block w-20 rounded border border-ink/20 px-3 py-2 text-sm"
          />
        </label>
        <button type="submit" className="rounded bg-navy px-4 py-2 text-sm font-semibold text-white">
          Add Image
        </button>
      </form>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {images.length === 0 && <p className="text-sm text-ink/50">No gallery images yet.</p>}
        {images.map((image) => (
          <div key={image.id} className="overflow-hidden rounded border border-ink/10 bg-white">
            <div className="relative aspect-square">
              <Image src={image.imageUrl} alt={image.caption ?? ""} fill className="object-cover" />
            </div>
            <div className="flex items-center justify-between p-2 text-xs">
              <span className="truncate text-ink/60">{image.caption || "—"}</span>
              <form
                action={async () => {
                  "use server";
                  await deleteGalleryImage(image.id);
                }}
              >
                <button type="submit" className="text-burgundy underline">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
