import type { ReactNode } from "react";

// Wraps text in two corner brackets — the "frame" motif.
export default function Framed({
  children,
  bracketClass = "border-orange",
}: {
  children: ReactNode;
  bracketClass?: string;
}) {
  return (
    <span className="relative pl-[0.12em] pr-[0.18em]">
      <span
        aria-hidden
        className={`absolute left-0 top-[0.06em] h-[0.32em] w-[0.32em] border-l-[0.09em] border-t-[0.09em] ${bracketClass}`}
      />
      <span
        aria-hidden
        className={`absolute bottom-[0.02em] right-0 h-[0.32em] w-[0.32em] border-b-[0.09em] border-r-[0.09em] ${bracketClass}`}
      />
      {children}
    </span>
  );
}
