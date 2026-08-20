import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [publicationCount, blogCount, updateCount, galleryCount] = await Promise.all([
    prisma.publication.count(),
    prisma.blogPost.count(),
    prisma.update.count(),
    prisma.galleryImage.count(),
  ]);

  const cards = [
    { label: "Publications", count: publicationCount, href: "/admin/publications" },
    { label: "Blog Posts", count: blogCount, href: "/admin/blog" },
    { label: "Updates", count: updateCount, href: "/admin/updates" },
    { label: "Gallery Images", count: galleryCount, href: "/admin/gallery" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded border border-ink/10 bg-white p-5 hover:border-navy"
          >
            <p className="text-3xl font-bold">{card.count}</p>
            <p className="mt-1 text-sm text-ink/60">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
