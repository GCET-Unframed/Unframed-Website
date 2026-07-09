import Link from "next/link";
import Wordmark from "./Wordmark";

export default function Footer() {
  return (
    <footer className="mt-auto">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 border-t border-charcoal/10 px-5 py-12 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <Wordmark className="text-3xl" />
          <p className="mt-3 max-w-xs text-sm text-stone">
            Unframe the story. Reframe your own opinion.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-stone">
          <Link href="/" className="hover:text-royal">Home</Link>
          <Link href="/about" className="hover:text-royal">About</Link>
          <Link href="/team" className="hover:text-royal">Our Team</Link>
          <Link href="/journal" className="hover:text-royal">Journal</Link>
          <Link href="/try-it" className="hover:text-royal">Try It</Link>
        </nav>
      </div>
      <div className="border-t border-charcoal/10">
        <p className="mx-auto max-w-6xl px-5 py-4 text-xs text-stone/70 sm:px-8">
          © {new Date().getFullYear()} Unframed. A student-led civic initiative.
        </p>
      </div>
    </footer>
  );
}
