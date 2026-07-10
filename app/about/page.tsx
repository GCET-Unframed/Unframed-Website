import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "About — Unframed",
  description:
    "Unframed helps young people recognize framing and bias in news and legislation. Ellipsis, our flagship browser extension, surfaces what shapes the story — without telling you what to believe.",
};

const missionParagraphs = [
  "We created Unframed because young people often want to understand politics, news, and policy, but it can be hard to know what sources to trust or where to even start. News articles often use biased framing, emotional language, selective sources, or missing context. Legislative bills can be difficult to read because they are long, technical, and unclear about who may be affected.",
  "Existing tools can be helpful, but they are often difficult to interpret, limited in the sources they cover, and are a separate page from the article or bill a user is actually reading. Unframed is designed to meet these needs. As an AI-based browser extension, Unframed helps users understand bias, framing, and missing perspectives directly on the page, showing how information is presented, what viewpoints are included, and what perspectives may be missing.",
  "Our mission is to support informed civic participation without telling users what to believe. By highlighting framing, evidence, uncertainty, and missing context, Unframed encourages readers to ask better questions and form their own views with greater confidence.",
];

const coreBeliefs = [
  {
    statement: "You’re the one who decides.",
    detail:
      "Our job stops at showing you the framing. What you conclude from it is entirely yours.",
  },
  {
    statement: "Legislation shouldn’t require a law degree to understand.",
    detail:
      "Bills are long, technical, and often intentionally hard to parse. Everyone affected by a law deserves to understand it in plain language.",
  },
  {
    statement: "Bias lives in the article, not just the outlet.",
    detail:
      "Rating a whole news organization tells you very little about the piece in front of you today. We look at the specific article or bill you’re actually reading.",
  },
  {
    statement: "Neutrality means showing our work.",
    detail:
      "Every claim we make is tied to a specific piece of text, a linked source, and a plain explanation of why we flagged it. If we’re not confident, we say so — clearly, every time.",
  },
  {
    statement: "Missing context is still bias.",
    detail:
      "What a story leaves out can shape your understanding as much as what it includes. We treat absence as seriously as presence.",
  },
];

export default function About() {
  return (
    <main className="flex-1">
      {/* Mission */}
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
        <FadeIn>
          <h1 className="max-w-4xl font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
            Our Mission
          </h1>
        </FadeIn>
        <div className="mt-8 max-w-3xl space-y-6">
          {missionParagraphs.map((paragraph, i) => (
            <FadeIn key={paragraph.slice(0, 24)} delay={0.1 + i * 0.08}>
              <p className="text-lg leading-relaxed text-stone sm:text-xl">
                {paragraph}
              </p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Our Core Beliefs */}
      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 sm:pb-32">
        <FadeIn>
          <p className="text-sm font-bold uppercase tracking-widest text-stone">
            Our Core Beliefs
          </p>
        </FadeIn>

        <div className="mt-8 space-y-10">
          {coreBeliefs.map(({ statement, detail }, i) => (
            <FadeIn key={statement} delay={i * 0.08}>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full font-display text-lg font-bold text-white ${
                    i === 2 ? "bg-pink" : "bg-orange"
                  }`}
                >
                  0{i + 1}
                </span>
                <div>
                  <h2 className="font-display text-2xl font-bold leading-snug text-charcoal sm:text-3xl">
                    {statement}
                  </h2>
                  <p className="mt-2 max-w-2xl text-base text-stone sm:text-lg">
                    {detail}
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
