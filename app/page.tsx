import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import Framed from "@/components/Framed";

const beliefs = [
  {
    statement: "Every story has a frame.",
    detail: "We help you see it.",
  },
  {
    statement: "Bias isn’t always loud.",
    detail: "Loaded words. Missing voices. Convenient omissions.",
  },
  {
    statement: "No one tells you what to think.",
    detail: "Not even us.",
  },
  {
    statement: "First votes should be informed votes.",
    detail: "Democracy works better that way.",
  },
];

// PLACEHOLDER figures — replace with real numbers before launch.
const stats = [
  { value: "[X]", label: "articles analyzed" },
  { value: "[X]", label: "bills decoded" },
  { value: "[X]", label: "student readers" },
];

// Hero entrance runs on plain CSS keyframes (see globals.css) so it always
// plays on load, independent of JS hydration timing or IntersectionObserver.
function heroAnim(
  delay: number,
  name: "fade-slide-up" | "fade-scale-in" = "fade-slide-up",
  duration = 0.7
) {
  return {
    animationName: name,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    animationTimingFunction: "ease-out",
    animationFillMode: "both",
  } as const;
}

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero — asymmetric two-column on desktop, fills the viewport */}
      <section className="mx-auto grid min-h-screen max-w-6xl content-center items-center gap-12 px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[7fr_5fr] lg:gap-8">
        <div>
          <p
            style={heroAnim(0)}
            className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-stone"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-royal" />
            A student-led civic initiative
          </p>
          <h1
            style={heroAnim(0.15)}
            className="mt-6 font-display text-6xl font-bold leading-[0.95] tracking-tight sm:text-8xl lg:text-9xl"
          >
            Un
            <Framed>framed</Framed>
          </h1>
          <p
            style={heroAnim(0.35)}
            className="mt-5 max-w-xl font-serif text-2xl italic text-stone sm:text-3xl"
          >
            Unframe the story. Reframe your own opinion.
          </p>
          <div style={heroAnim(0.55)} className="mt-10 flex flex-wrap items-center gap-5">
            <Link
              href="/try-it"
              className="rounded-full bg-royal px-8 py-4 text-base font-bold text-white transition hover:bg-royal-deep"
            >
              Try our first tool
            </Link>
            <Link
              href="/about"
              className="text-base font-bold text-charcoal underline decoration-2 underline-offset-4 transition hover:text-royal"
            >
              What we&rsquo;re about →
            </Link>
          </div>
        </div>

        {/* Clean geometric composition */}
        <div aria-hidden className="relative mx-auto hidden h-80 w-80 lg:block">
          <div
            style={heroAnim(0.15, "fade-scale-in", 0.6)}
            className="absolute right-0 top-0 h-44 w-44 rounded-full bg-royal"
          />
          <div
            style={heroAnim(0.3, "fade-scale-in", 0.6)}
            className="absolute bottom-6 left-0 h-36 w-36 rounded-full bg-orange-soft"
          />
          <div
            style={heroAnim(0.45, "fade-scale-in", 0.6)}
            className="absolute bottom-0 right-14 h-20 w-20 rounded-[1.75rem] bg-orange"
          />
          <div className="absolute left-8 top-10 h-5 w-5 rounded-full bg-royal-soft" />
          <div className="absolute left-0 top-24 h-px w-24 bg-charcoal/30" />
        </div>
      </section>

      {/* What we believe — sits directly on the shared page gradient */}
      <section>
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <FadeIn>
            <p className="text-sm font-bold uppercase tracking-widest text-stone">
              What we believe
            </p>
          </FadeIn>
          <div className="mt-10 grid gap-x-12 gap-y-12 sm:grid-cols-2">
            {beliefs.map(({ statement, detail }, i) => (
              <FadeIn key={statement} delay={i * 0.08}>
                <p className="font-display text-sm font-bold text-orange">
                  0{i + 1}
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold leading-snug text-charcoal sm:text-3xl">
                  {statement}
                </h2>
                <p className="mt-2 text-base text-stone">{detail}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Ellipsis teaser */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[5fr_7fr]">
        <FadeIn>
          <div aria-hidden className="flex items-center gap-3">
            <span className="h-4 w-4 rounded-full bg-royal" />
            <span className="h-4 w-4 rounded-full bg-orange" />
            <span className="h-4 w-4 rounded-full bg-royal" />
          </div>
          <p className="mt-6 text-sm font-bold uppercase tracking-widest text-stone">
            Our first tool
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Ellipsis
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-lg text-stone sm:text-xl">
            A Chrome extension that reads alongside you — surfacing framing,
            loaded language, and missing perspectives in news articles and
            congressional bills. Without ever telling you what to believe.
          </p>
          <Link
            href="/about"
            className="mt-6 inline-block text-base font-bold text-charcoal underline decoration-2 underline-offset-4 transition hover:text-royal"
          >
            More about what we do →
          </Link>
        </FadeIn>
      </section>

      {/* Impact stats (placeholder) */}
      <section>
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="grid gap-10 sm:grid-cols-3">
            {stats.map(({ value, label }, i) => (
              <FadeIn key={label} delay={i * 0.08}>
                <p className="font-display text-5xl font-bold text-royal sm:text-6xl">
                  {value}
                </p>
                <p className="mt-2 text-base font-semibold text-charcoal">
                  {label}
                </p>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.3}>
            <p className="mt-10 text-xs font-semibold uppercase tracking-widest text-stone">
              Placeholder figures — real numbers coming soon
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Final CTA */}
      <section>
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-5 py-20 sm:px-8 sm:py-24 lg:flex-row lg:items-center lg:justify-between">
          <FadeIn>
            <h2 className="max-w-xl font-display text-4xl font-bold tracking-tight text-charcoal sm:text-5xl">
              Ready to read between the lines?
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Link
              href="/try-it"
              className="inline-block rounded-full bg-orange px-9 py-4 text-base font-bold text-white transition hover:bg-orange-deep"
            >
              Try It
            </Link>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
