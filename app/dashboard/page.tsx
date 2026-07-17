import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import FadeIn from "@/components/FadeIn";
import BillFeed from "./BillFeed";
import type { InterestArea } from "@/lib/civicProfileOptions";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const firstName = session?.user?.name?.split(" ")[0];

  const supabase = getSupabaseServerClient();
  const { data: profile } = await supabase
    .from("CivicProfile")
    .select("state, interestAreas")
    .eq("userId", session!.user!.id)
    .maybeSingle();

  return (
    <main className="flex-1 px-5 py-16 sm:px-8">
      <FadeIn immediate className="mx-auto max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-widest text-stone">
          Your legislation feed
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl">
          {firstName ? `Welcome back, ${firstName}.` : "Welcome back."}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-stone">
          Bills from {profile?.state ?? "your state"} and Congress, filtered by what
          actually affects you.
        </p>
      </FadeIn>

      <div className="mx-auto mt-10 max-w-3xl">
        {profile && (
          <BillFeed
            userState={profile.state as string}
            defaultTopics={profile.interestAreas as InterestArea[]}
          />
        )}
      </div>
    </main>
  );
}
