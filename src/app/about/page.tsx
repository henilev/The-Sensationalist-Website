export const metadata = { title: "About | The Sensationalist" };

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="font-display text-3xl font-bold">About</h1>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold text-burgundy">Mission</h2>
        <p className="mt-3 text-ink/80">
          [Placeholder] The Sensationalist exists to give creative writing and art the room —
          and the audience — it deserves. We publish work that takes risks: essays, fiction,
          journalism, and visual art that make a case for paying closer attention.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold text-burgundy">Get Involved</h2>
        <p className="mt-3 text-ink/80">
          [Placeholder] Whether you want to write, edit, illustrate, or help run things behind
          the scenes, we're always looking for new collaborators. Reach out and tell us what
          you're interested in.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold text-burgundy">Submit Work</h2>
        <p className="mt-3 text-ink/80">
          [Placeholder] We accept submissions of essays, short and long fiction, journalism,
          how-tos, and visual art on a rolling basis. Details on format and how to send us your
          work will go here.
        </p>
      </section>
    </div>
  );
}
