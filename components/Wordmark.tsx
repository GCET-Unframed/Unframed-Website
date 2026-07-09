import Link from "next/link";
import Framed from "./Framed";

// Styled wordmark: "un" + "framed" caught inside orange corner brackets —
// the frame motif made literal.
export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`font-display font-bold tracking-tight text-charcoal inline-flex items-baseline ${className}`}
    >
      <span>un</span>
      <Framed>framed</Framed>
    </Link>
  );
}
