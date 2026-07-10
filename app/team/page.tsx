import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Our Team — Unframed",
  description: "The students behind Unframed.",
};

const members = [
  { initials: "01", name: "Saanj Rao", role: "Executive Director", avatar: "bg-orange text-white" },
  { initials: "02", name: "Sarah Zhang", role: "Executive Director", avatar: "bg-royal text-white" },
  { initials: "03", name: "Jay Huo", role: "Director of Technology", avatar: "bg-orange text-white" },
  { initials: "04", name: "Mylan Gardner", role: "Director of Research & Outreach", avatar: "bg-royal text-white" },
  { initials: "05", name: "Pearson Wu", role: "Director of Technology", avatar: "bg-orange text-white" },
  { initials: "06", name: "Stephanie Chen", role: "Director of Research", avatar: "bg-royal text-white" },
];

const advisors = [
  { initials: "01", name: "Ting Su", avatar: "bg-royal text-white" },
  { initials: "02", name: "Gang Liu", avatar: "bg-orange text-white" },
];

export default function Team() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-5 pb-24 pt-16 sm:px-8 sm:pb-32 sm:pt-24">
        <FadeIn>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
            Our Team
          </h1>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="mt-5 max-w-2xl font-serif text-2xl italic text-stone sm:text-3xl">
            Students, unframing the news.
          </p>
        </FadeIn>

        <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2">
          {members.map(({ initials, name, role, avatar }, i) => (
            <FadeIn key={initials} delay={i * 0.06}>
              <div className="flex items-center gap-5">
                <span
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full font-display text-xl font-bold ${avatar}`}
                >
                  {initials}
                </span>
                <div>
                  <p className="font-display text-lg font-bold">{name}</p>
                  <p className="mt-0.5 text-base text-stone">{role}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.1}>
          <p className="mt-20 text-sm font-bold uppercase tracking-widest text-stone">
            Advisors
          </p>
        </FadeIn>
        <div className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2">
          {advisors.map(({ initials, name, avatar }, i) => (
            <FadeIn key={initials} delay={i * 0.06}>
              <div className="flex items-center gap-5">
                <span
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full font-display text-xl font-bold ${avatar}`}
                >
                  {initials}
                </span>
                <p className="font-display text-lg font-bold">{name}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
    </main>
  );
}
