import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";
import Framed from "@/components/Framed";

export const metadata: Metadata = {
  title: "Ellipsis — Unframed",
  description:
    "Ellipsis is a Chrome extension that analyzes news articles in real time for bias, framing, and missing perspectives.",
};

const steps = [
  "Open Ellipsis while reading a news article or bill online.",
  "Get an analysis card built for that specific piece of content — organized into simple, focused tabs.",
  "Follow the evidence. Every major claim links back to the original text and its source, with a plain explanation of why it was flagged.",
  "Tell us what you think. Mark an analysis as Helpful, Confusing, Incorrect, or Biased — your feedback shapes how we improve.",
];

export default function Ellipsis() {
  return (
    <main id="main-content" className="flex-1">
      {/* Intro */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-16 sm:px-8 sm:pt-24">
        <FadeIn>
          <div aria-hidden className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-royal" />
            <span className="h-3 w-3 rounded-full bg-orange" />
            <span className="h-3 w-3 rounded-full bg-royal" />
          </div>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
            Meet <Framed>Ellipsis</Framed>.
          </h1>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="mt-6 max-w-2xl text-lg text-stone sm:text-xl">
            Ellipsis is a Chrome extension that analyzes news articles in
            real time — surfacing bias, framing, and the perspectives a
            story includes or leaves out, right where you&apos;re reading.
            See how different outlets cover the same story, and the
            patterns start to speak for themselves. Over time, that builds
            real media literacy: not a score to take on faith, but a
            clearer, more independent read on the news.
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

      {/* Early access note */}
      <section className="mx-auto max-w-4xl px-5 pb-24 pt-16 sm:px-8 sm:pb-32 sm:pt-20">
        <FadeIn>
          <div className="rounded-3xl border border-white/50 bg-white/30 p-6 text-center shadow-[0_8px_32px_rgba(43,79,224,0.15)] backdrop-blur-lg sm:p-8">
            <p className="text-lg text-stone">
              Ellipsis isn&apos;t on the Chrome Web Store yet. If
              you&apos;re interested in early access, reach out.
            </p>
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
