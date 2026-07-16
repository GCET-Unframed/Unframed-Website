import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import FadeIn from "@/components/FadeIn";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const firstName = session?.user?.name?.split(" ")[0];

  return (
    <main className="flex flex-1 items-center justify-center px-5 py-24 sm:px-8">
      <FadeIn immediate className="max-w-xl text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-stone">
          You&apos;re all set
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
          {firstName ? `Welcome, ${firstName}.` : "Welcome."}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone">
          Your civic profile is saved. The personalized legislation feed and
          reading digest land here in a later phase — for now, this
          confirms your onboarding worked end to end.
        </p>
      </FadeIn>
    </main>
  );
}
