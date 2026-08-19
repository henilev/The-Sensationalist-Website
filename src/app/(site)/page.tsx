import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatTag } from "@/lib/tags";

export default async function Home() {
  const [recentPublications, recentBlogPosts, mostViewedPublications, updates, galleryImages] =
    await Promise.all([
      prisma.publication.findMany({ orderBy: { datePublished: "desc" }, take: 3 }),
      prisma.blogPost.findMany({ orderBy: { datePublished: "desc" }, take: 3 }),
      prisma.publication.findMany({ orderBy: { views: "desc" }, take: 5 }),
      prisma.update.findMany({ orderBy: { datePublished: "desc" }, take: 2 }),
      prisma.galleryImage.findMany({ orderBy: { order: "asc" }, take: 8 }),
    ]);

  const newestReleases = [...recentPublications, ...recentBlogPosts]
    .sort((a, b) => b.datePublished.getTime() - a.datePublished.getTime())
    .slice(0, 3);

  const [pinnedPublications, pinnedBlogPosts] = await Promise.all([
    prisma.publication.findMany({ where: { pinned: true }, orderBy: { datePublished: "desc" } }),
    prisma.blogPost.findMany({ where: { pinned: true }, orderBy: { datePublished: "desc" } }),
  ]);
  const pinnedPosts = [...pinnedPublications, ...pinnedBlogPosts]
    .sort((a, b) => b.datePublished.getTime() - a.datePublished.getTime())
    .slice(0, 3);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-12">
      <section>
        <SectionLabel>Newest Releases</SectionLabel>
        <div className="mt-4 grid gap-6 sm:grid-cols-3">
          {newestReleases.length === 0 && <EmptyState label="Nothing published yet." />}
          {newestReleases.map((item) => (
            <article key={item.id} className="overflow-hidden rounded border border-ink/10 bg-white">
              <CoverImage src={item.coverImageUrl} alt={item.title} />
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-burgundy">
                  {"pdfUrl" in item ? "Publication" : "Blog"}
                </p>
                <h3 className="mt-2 font-display text-lg font-bold leading-snug">{item.title}</h3>
                <p className="mt-2 text-sm text-ink/70">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {pinnedPosts.length > 0 && (
        <section>
          <SectionLabel>Pinned</SectionLabel>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            {pinnedPosts.map((item) => (
              <article key={item.id} className="overflow-hidden rounded border border-gold/40 bg-white">
                <CoverImage src={item.coverImageUrl} alt={item.title} />
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gold">
                    Pinned &middot; {"pdfUrl" in item ? "Publication" : "Blog"}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-bold leading-snug">{item.title}</h3>
                  <p className="mt-2 text-sm text-ink/70">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section>
        <SectionLabel>Most Viewed</SectionLabel>
        <div className="mt-4 flex gap-6 overflow-x-auto pb-2">
          {mostViewedPublications.length === 0 && <EmptyState label="No publications yet." />}
          {mostViewedPublications.map((pub) => (
            <article
              key={pub.id}
              className="w-64 shrink-0 overflow-hidden rounded border border-ink/10 bg-white"
            >
              <CoverImage src={pub.coverImageUrl} alt={pub.title} />
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-navy">
                  {formatTag(pub.typeTag)}
                </p>
                <h3 className="mt-2 font-display text-base font-bold leading-snug">{pub.title}</h3>
                <p className="mt-2 text-xs text-ink/50">{pub.views} views</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionLabel>Photo Gallery</SectionLabel>
        {galleryImages.length === 0 ? (
          <EmptyState label="Gallery photos coming soon." />
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {galleryImages.map((image) => (
              <div key={image.id} className="relative aspect-square overflow-hidden rounded">
                <Image
                  src={image.imageUrl}
                  alt={image.caption ?? ""}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionLabel>Updates</SectionLabel>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          {updates.length === 0 && <EmptyState label="No updates yet." />}
          {updates.map((update) => (
            <article key={update.id} className="rounded border border-ink/10 bg-white p-5">
              <h3 className="font-display text-lg font-bold leading-snug">{update.title}</h3>
              <p className="mt-2 text-sm text-ink/70">
                {update.datePublished.toLocaleDateString()}
              </p>
            </article>
          ))}
        </div>
      </section>

      <p className="text-center text-sm text-ink/50">
        Looking for everything we've published? Visit{" "}
        <Link href="/publications" className="text-burgundy underline">
          Publications
        </Link>{" "}
        or the{" "}
        <Link href="/blog" className="text-burgundy underline">
          Blog
        </Link>
        .
      </p>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="border-b border-ink/10 pb-2 text-sm font-bold uppercase tracking-[0.2em] text-navy">
      {children}
    </h2>
  );
}

function EmptyState({ label }: { label: string }) {
  return <p className="text-sm italic text-ink/40">{label}</p>;
}

function CoverImage({ src, alt }: { src: string | null; alt: string }) {
  if (!src) return null;
  return (
    <div className="relative aspect-[16/9]">
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  );
}
