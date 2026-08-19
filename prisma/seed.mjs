import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const existing = await prisma.publication.count();
  if (existing > 0) {
    console.log("Sample data already present, skipping seed.");
    return;
  }

  const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

  await prisma.publication.createMany({
    data: [
      {
        title: "Issue No. 12: Concrete and Static",
        description:
          "Our latest issue on cities, noise, and the spaces in between — essays, fiction, and photography.",
        pdfUrl: "https://example.com/placeholder-issue-12.pdf",
        typeTag: "ISSUE",
        contentTag: "CULTURE",
        author: "The Sensationalist Staff",
        pageLength: 64,
        pinned: true,
        views: 512,
        datePublished: daysAgo(1),
      },
      {
        title: "The Weight of Small Rooms",
        description: "An essay on growing up in cramped apartments and what they teach you about ambition.",
        pdfUrl: "https://example.com/placeholder-essay.pdf",
        typeTag: "ESSAY",
        contentTag: "ESSAY",
        author: "Priya Nathan",
        pageLength: 8,
        pinned: false,
        views: 128,
        datePublished: daysAgo(5),
      },
      {
        title: "Volume III: Afterlives",
        description: "A full volume exploring memory, inheritance, and what outlives us.",
        pdfUrl: "https://example.com/placeholder-volume-3.pdf",
        typeTag: "VOLUME",
        contentTag: "CULTURE",
        author: "The Sensationalist Staff",
        pageLength: 96,
        pinned: false,
        views: 340,
        datePublished: daysAgo(9),
      },
    ],
  });

  await prisma.blogPost.createMany({
    data: [
      {
        title: "Notes From the Editor's Desk",
        description: "What we're looking for in the next open reading period.",
        richTextBody: "<p>Placeholder body text for the editor's note.</p>",
        contentTag: "OPINION",
        author: "The Sensationalist Staff",
        pinned: true,
        datePublished: daysAgo(2),
      },
      {
        title: "Why We Publish Fiction We Don't Fully Understand",
        description: "On the value of ambiguity in short fiction.",
        richTextBody: "<p>Placeholder body text about ambiguity in fiction.</p>",
        contentTag: "FICTION",
        author: "Marcus Oduya",
        pinned: false,
        datePublished: daysAgo(4),
      },
      {
        title: "A Conversation With Our Cover Artist",
        description: "An interview about the illustration on Issue No. 12.",
        richTextBody: "<p>Placeholder interview transcript.</p>",
        contentTag: "VISUAL_ART",
        author: "The Sensationalist Staff",
        pinned: false,
        datePublished: daysAgo(7),
      },
    ],
  });

  await prisma.update.createMany({
    data: [
      {
        title: "Submissions for Issue 13 are open",
        richTextBody: "<p>We're reading fiction, essays, and art through the end of the month.</p>",
        author: "The Sensationalist Staff",
        datePublished: daysAgo(1),
      },
      {
        title: "New print run now shipping",
        richTextBody: "<p>Issue No. 12 print copies are back in stock and shipping this week.</p>",
        author: "The Sensationalist Staff",
        datePublished: daysAgo(3),
      },
    ],
  });

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
