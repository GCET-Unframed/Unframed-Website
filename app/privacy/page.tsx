import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Privacy Policy — Unframed",
  description:
    "What Unframed collects, why, and how you can control it — in plain language.",
};

const principles = [
  {
    statement: "Transparency first.",
    detail:
      "Every field we ask for on the dashboard comes with a plain-language reason it helps. This page exists so that reason is never more than a click away.",
  },
  {
    statement: "Minimal collection.",
    detail:
      "We only collect what changes what you see. If a field doesn't affect your legislation feed or reading digest, we don't ask for it.",
  },
  {
    statement: "No article tracking.",
    detail:
      "Ellipsis's analysis of what you read happens entirely in your browser. Article text, titles, and URLs never leave your device — only a weekly summary (article count, bias-cue-strength distribution, topic counts, and a count of distinct sources) syncs to your dashboard, and only once you've connected Ellipsis to your account.",
  },
  {
    statement: "No selling or sharing.",
    detail:
      "Unframed does not sell or share your data with third parties, and never will. Legislative data flows one way — from LegiScan and Congress.gov to your dashboard — nothing about you is sent back to them.",
  },
  {
    statement: "Demographic sensitivity.",
    detail:
      "Citizenship status and other sensitive fields are always optional, and are used solely to personalize the legislation shown on your own dashboard — never for any other purpose.",
  },
];

const dataTable = [
  {
    category: "Account (from Google Sign-In)",
    fields: "Email address, display name, profile photo",
    why: "To identify your account and greet you by name. We don't see or store your Google password.",
  },
  {
    category: "Civic profile",
    fields:
      "State and city (required); interest areas (required, minimum one); citizenship status, ethnicity, education level, income range, and age range (all optional)",
    why: "To determine which state and federal bills are shown to you, and why each one is relevant.",
  },
  {
    category: "Saved and dismissed bills",
    fields: "Which bills you've saved or dismissed",
    why: "So your feed remembers your choices between visits.",
  },
  {
    category: "Weekly reading digest (only if Ellipsis is connected)",
    fields:
      "Article count, bias-cue-strength distribution, topic counts, and a count of distinct sources for the week",
    why: "To show the Reading Digest panel on your dashboard. Never individual article URLs, titles, or text.",
  },
];

export default function Privacy() {
  return (
    <main id="main-content" className="flex-1">
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-16 sm:px-8 sm:pt-24">
        <FadeIn>
          <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
            Privacy Policy
          </h1>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone sm:text-xl">
            Unframed is built on a simple premise: you should be able to see
            exactly what we know about you and why. This page describes what
            we collect today, in plain language — no legal boilerplate.
          </p>
        </FadeIn>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <FadeIn>
          <h2 className="text-sm font-bold uppercase tracking-widest text-stone">
            Our principles
          </h2>
        </FadeIn>
        <div className="mt-8 space-y-8">
          {principles.map(({ statement, detail }, i) => (
            <FadeIn key={statement} delay={i * 0.06}>
              <h3 className="font-display text-xl font-bold text-charcoal sm:text-2xl">
                {statement}
              </h3>
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-stone sm:text-lg">
                {detail}
              </p>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <FadeIn>
          <h2 className="text-sm font-bold uppercase tracking-widest text-stone">
            What we collect
          </h2>
        </FadeIn>
        <div className="mt-8 space-y-8">
          {dataTable.map(({ category, fields, why }, i) => (
            <FadeIn key={category} delay={i * 0.06}>
              <div className="rounded-2xl border border-stone/15 bg-white/70 p-6">
                <p className="font-display text-lg font-bold text-charcoal">
                  {category}
                </p>
                <p className="mt-2 text-base text-charcoal">{fields}</p>
                <p className="mt-2 text-sm text-stone">{why}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <FadeIn>
          <h2 className="text-sm font-bold uppercase tracking-widest text-stone">
            Who else sees it
          </h2>
        </FadeIn>
        <FadeIn delay={0.06}>
          <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-stone sm:text-lg">
            <p>
              <strong className="text-charcoal">Google</strong> handles sign-in
              only. We receive your email, name, and profile photo through
              standard OAuth — nothing more.
            </p>
            <p>
              <strong className="text-charcoal">LegiScan and Congress.gov</strong>{" "}
              are the public sources for the bills shown on your dashboard.
              Data flows one direction, from them to you — we don&apos;t send
              them anything about who you are or what you&apos;ve read.
            </p>
            <p>
              <strong className="text-charcoal">Ellipsis</strong>, our Chrome
              extension, keeps its bias and framing analysis entirely on your
              device. If you connect it to your Unframed account, it syncs
              only the weekly aggregate summary described above — never
              article content.
            </p>
          </div>
        </FadeIn>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 pt-16 sm:px-8 sm:pb-32 sm:pt-20">
        <FadeIn>
          <h2 className="text-sm font-bold uppercase tracking-widest text-stone">
            Your control over your data
          </h2>
        </FadeIn>
        <FadeIn delay={0.06}>
          <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-stone sm:text-lg">
            <p>
              We&apos;re still building self-serve tools to edit your civic
              profile and delete your account directly from the dashboard —
              they aren&apos;t available yet. In the meantime, you can clear
              your Ellipsis reading history at any time from the extension,
              and you can reach out to us directly to update or remove any
              information we hold about you.
            </p>
            <p>
              We&apos;ll update this page the moment self-serve edit and
              delete tools ship, and reflect exactly what&apos;s true of the
              product at the time — not what we plan for it to do someday.
            </p>
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
