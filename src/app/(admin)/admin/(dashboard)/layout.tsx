import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { logoutAction } from "./actions";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/publications", label: "Publications" },
  { href: "/admin/blog", label: "Blog Posts" },
  { href: "/admin/updates", label: "Updates" },
  { href: "/admin/gallery", label: "Gallery" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen flex-1">
      <aside className="w-56 shrink-0 border-r border-ink/10 bg-navy text-paper">
        <div className="px-5 py-6">
          <p className="text-sm font-bold tracking-wide text-gold">THE SENSATIONALIST</p>
          <p className="text-xs text-paper/50">Admin</p>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded px-2 py-2 text-sm text-paper/80 hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction} className="mt-6 px-3">
          <button
            type="submit"
            className="w-full rounded px-2 py-2 text-left text-sm text-paper/60 hover:bg-white/10 hover:text-white"
          >
            Log out
          </button>
        </form>
      </aside>
      <div className="flex-1 px-8 py-8">{children}</div>
    </div>
  );
}
