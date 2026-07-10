import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Journal — Unframed",
  description: "A running log of Unframed project milestones and updates.",
};

const entries = [
  {
    date: "July 9",
    text: "Refined the prototype’s interface to be more intuitive and human-readable, while significantly simplifying the overall user experience. Established three core bias categories — political, ethnic, and gender — to structure the analysis framework, finalized the criteria for the bias scoring system, and published the Unframed website.",
    marker: "bg-royal",
  },
  {
    date: "July 8",
    text: "Pushed the first working prototype to Chrome’s extension developer mode, marking the shift from concept to a functioning, testable tool.",
    marker: "bg-orange",
  },
  {
    date: "July 7",
    text: "Finalized the team and settled on the project’s core idea and direction, further developing the concept behind Unframed and clarifying the problem it aims to solve.",
    marker: "bg-pink",
  },
  {
    date: "July 6",
    text: "Kicked off the project with a brainstorming session, met with the TA for early guidance, continued background research, and designed the initial visual layout for the site.",
    marker: "bg-orange",
  },
];

export default function Journal() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-5 pb-24 pt-16 sm:px-8 sm:pb-32 sm:pt-24">
        <FadeIn>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
            Journal
          </h1>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="mt-5 max-w-2xl font-serif text-2xl italic text-stone sm:text-3xl">
            A running log of milestones, as we build them.
          </p>
        </FadeIn>

        {/* Timeline — most recent entry first */}
        <div className="relative mt-16 max-w-2xl space-y-12">
          <div
            aria-hidden
            className="absolute bottom-2 left-[7px] top-2 w-px bg-charcoal/15"
          />
          {entries.map(({ date, text, marker }, i) => (
            <FadeIn key={date} delay={i * 0.1}>
              <div className="relative flex gap-6">
                <span
                  aria-hidden
                  className={`mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${marker}`}
                />
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-stone">
                    {date}
                  </p>
                  <p className="mt-2 text-lg text-stone sm:text-xl">
                    {text}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
    </main>
  );
}
