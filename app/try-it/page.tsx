import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";
import Framed from "@/components/Framed";

export const metadata: Metadata = {
  title: "Try It — Unframed",
  description: "Our first tool is almost ready.",
};

export default function TryIt() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-5 py-32 text-center">
      <FadeIn>
        <div aria-hidden className="mx-auto flex w-fit items-center gap-3">
          <span className="h-4 w-4 rounded-full bg-royal" />
          <span className="h-4 w-4 rounded-full bg-orange" />
          <span className="h-4 w-4 rounded-full bg-royal" />
        </div>
        <h1 className="mt-8 font-display text-4xl font-bold text-charcoal sm:text-6xl">
          Coming <Framed>soon</Framed>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg text-stone">
          Our first tool is almost ready. Check back shortly.
        </p>
      </FadeIn>
    </main>
  );
}
