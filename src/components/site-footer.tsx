export function SiteFooter() {
  return (
    <footer className="mt-auto bg-navy text-paper">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm">
        <p className="font-display text-lg font-bold text-gold">The Sensationalist</p>
        <p className="mt-2 max-w-md text-paper/70">
          A magazine of essays, stories, and dispatches worth making a scene about.
        </p>
        <p className="mt-6 text-xs text-paper/50">
          &copy; {new Date().getFullYear()} The Sensationalist. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
