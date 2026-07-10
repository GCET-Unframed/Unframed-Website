import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";
import Framed from "@/components/Framed";

export const metadata: Metadata = {
  title: "Try It — Unframed",
  description:
    "See how Ellipsis breaks down framing and bias in news articles and legislation.",
};

const steps = [
  "Open Ellipsis while reading a news article or bill online.",
  "Get an analysis card built for that specific piece of content — organized into simple, focused tabs.",
  "Follow the evidence. Every major claim links back to the original text and its source, with a plain explanation of why it was flagged.",
  "Tell us what you think. Mark an analysis as Helpful, Confusing, Incorrect, or Biased — your feedback shapes how we improve.",
];

export default function TryIt() {
  return (
    <main className="flex-1">
      {/* Intro */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-16 sm:px-8 sm:pt-24">
        <FadeIn>
          <div aria-hidden className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-royal" />
            <span className="h-3 w-3 rounded-full bg-orange" />
            <span className="h-3 w-3 rounded-full bg-royal" />
          </div>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
            See the <Framed>frame</Framed> behind the story.
          </h1>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="mt-6 max-w-2xl text-lg text-stone sm:text-xl">
            Ellipsis is a browser extension for anyone trying to make sense
            of political news and legislation. Open it while reading an
            article or a bill, and it shows you a short, focused analysis
            right where you are. No new tabs, no jargon, no lecture on what
            to think.
          </p>
        </FadeIn>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <FadeIn>
          <p className="text-sm font-bold uppercase tracking-widest text-stone">
            How it works
          </p>
        </FadeIn>
        <div className="mt-10 space-y-8">
          {steps.map((step, i) => (
            <FadeIn key={step} delay={i * 0.08}>
              <div className="flex gap-5">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-base font-bold text-white ${
                    i % 2 === 0 ? "bg-royal" : "bg-orange"
                  }`}
                >
                  {i + 1}
                </span>
                <p className="pt-1.5 text-lg text-charcoal sm:text-xl">
                  {step}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Prototype preview — visual mockup only, not wired up */}
      <section className="mx-auto max-w-4xl px-5 pb-24 pt-16 sm:px-8 sm:pb-32 sm:pt-20">
        <FadeIn>
          <h2 className="text-center font-display text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
            Try it yourself
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="mx-auto mt-3 max-w-xl text-center text-lg text-stone">
            Paste in a news article or bill excerpt to see how Ellipsis
            breaks it down.
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="mt-10 rounded-3xl border border-white/50 bg-white/30 p-6 shadow-[0_8px_32px_rgba(43,79,224,0.15)] backdrop-blur-lg sm:p-8">
            <textarea
              placeholder="Paste an article or bill excerpt here..."
              rows={6}
              className="w-full resize-none rounded-2xl border border-white/60 bg-white/50 p-4 text-base text-charcoal placeholder:text-stone/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-royal/40"
            />
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                className="rounded-full border border-white/30 bg-royal/85 px-8 py-3 text-base font-bold text-white shadow-[0_8px_24px_rgba(43,79,224,0.35)] backdrop-blur-md transition hover:bg-royal-deep/90"
              >
                Analyze
              </button>
            </div>
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
