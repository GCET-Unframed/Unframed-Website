import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getLastRefreshedAt } from "@/lib/bills";
import { INTEREST_AREAS } from "@/lib/civicProfileOptions";
import FadeIn from "@/components/FadeIn";
import SignOutButton from "@/components/SignOutButton";
import type { TopicCounts, WeeklyReadingDigestRecord } from "@/types/digest";

function topicLabel(value: string): string {
  return INTEREST_AREAS.find((a) => a.value === value)?.label ?? value;
}

function dominantTopic(topTopics: TopicCounts): string | null {
  let best: string | null = null;
  let bestCount = 0;
  for (const [key, count] of Object.entries(topTopics)) {
    if ((count ?? 0) > bestCount) {
      best = key;
      bestCount = count ?? 0;
    }
  }
  return best;
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const firstName = session?.user?.name?.split(" ")[0];
  const userId = session!.user!.id;

  const supabase = getSupabaseServerClient();
  const lastRefreshedAt = await getLastRefreshedAt();

  const { data: latestDigestRow } = await supabase
    .from("WeeklyReadingDigest")
    .select("*")
    .eq("userId", userId)
    .order("weekOf", { ascending: false })
    .limit(1)
    .maybeSingle();

  const digest = latestDigestRow as WeeklyReadingDigestRecord | null;
  const topTopic = digest ? dominantTopic(digest.topTopics) : null;

  return (
    <main id="main-content" className="flex-1 px-5 py-16 sm:px-8">
      <FadeIn immediate className="mx-auto max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-widest text-stone">
          Your dashboard
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl">
          {firstName ? `Welcome back, ${firstName}.` : "Welcome back."}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-stone">
          A quick snapshot of your legislation feed and reading habits.
        </p>
      </FadeIn>

      <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
        <FadeIn>
          <div className="flex h-full flex-col rounded-3xl border border-stone/15 bg-white/70 p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-stone">
              Legislation feed
            </p>
            <p className="mt-4 text-lg leading-relaxed text-charcoal">
              Bills from your state and Congress, filtered by what actually affects you.
            </p>
            <p className="mt-2 text-xs text-stone">
              {lastRefreshedAt
                ? `Last refreshed ${new Date(lastRefreshedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}`
                : "Not refreshed yet"}
            </p>
            <Link
              href="/dashboard/bills"
              className="mt-auto inline-block w-fit self-start rounded-full bg-royal px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-royal-deep"
            >
              View your bills
            </Link>
          </div>
        </FadeIn>

        <FadeIn delay={0.06}>
          <div className="flex h-full flex-col rounded-3xl border border-stone/15 bg-white/70 p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-stone">
              Reading digest
            </p>
            <p className="mt-4 font-display text-4xl font-bold text-charcoal">
              {digest ? digest.articlesAnalyzed : "—"}
            </p>
            <p className="mt-1 text-stone">
              {digest ? "articles analyzed this week" : "No digest yet"}
            </p>
            <p className="mt-2 text-xs text-stone">
              {topTopic
                ? `Mostly about ${topicLabel(topTopic).toLowerCase()}`
                : "Connect Ellipsis to get started"}
            </p>
            <Link
              href="/dashboard/digest"
              className="mt-auto inline-block w-fit self-start rounded-full bg-royal px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-royal-deep"
            >
              View your digest
            </Link>
          </div>
        </FadeIn>
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <SignOutButton />
      </div>
    </main>
  );
}
