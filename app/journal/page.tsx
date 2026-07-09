import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Journal — Unframed",
  description: "A running log of Unframed project milestones and updates.",
};

export default function Journal() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-5 pb-24 pt-16 sm:px-8 sm:pb-32 sm:pt-24">
        <FadeIn>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
            Journal
          </h1>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="mt-5 max-w-2xl font-serif text-2xl italic text-stone sm:text-3xl">
            A running log of milestones, as we build them.
          </p>
        </FadeIn>

        {/* Timeline shell — no entries yet */}
        <div className="relative mt-16 max-w-2xl">
          <div
            aria-hidden
            className="absolute bottom-2 left-[7px] top-2 w-px bg-charcoal/15"
          />
          <FadeIn delay={0.3}>
            <div className="relative flex gap-6">
              <span
                aria-hidden
                className="mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-royal bg-white"
              />
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-stone">
                  Coming soon
                </p>
                <p className="mt-2 text-lg text-stone sm:text-xl">
                  We haven&rsquo;t logged any milestones yet. Check back as
                  we start shipping updates.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
