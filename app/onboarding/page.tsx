import type { Metadata } from "next";
import OnboardingForm from "./OnboardingForm";

export const metadata: Metadata = {
  title: "Build your civic profile — Unframed",
  description:
    "Tell us a little about yourself so Unframed can surface the legislation that actually affects you.",
};

export default function OnboardingPage() {
  return (
    <main id="main-content" className="flex-1">
      <OnboardingForm />
    </main>
  );
}
