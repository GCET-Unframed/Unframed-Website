import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import ExtensionTokenPanel from "../ExtensionTokenPanel";

export default function SettingsPage() {
  return (
    <main id="main-content" className="flex-1 px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/dashboard" className="text-sm font-semibold text-stone hover:text-royal">
          ← Dashboard
        </Link>
        <FadeIn immediate>
          <p className="mt-4 text-sm font-bold uppercase tracking-widest text-stone">Settings</p>
          <h1 className="mt-3 font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl">
            Connect Ellipsis
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-stone">
            Manage the tokens Ellipsis uses to sync your reading digest and saved article
            analyses to this dashboard.
          </p>
        </FadeIn>
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <FadeIn>
          <ExtensionTokenPanel />
        </FadeIn>
      </div>
    </main>
  );
}
