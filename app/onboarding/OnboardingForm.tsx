"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import {
  US_STATES,
  INTEREST_AREAS,
  CITIZENSHIP_STATUS_OPTIONS,
  ETHNICITY_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
  INCOME_RANGE_OPTIONS,
  AGE_RANGE_OPTIONS,
  type InterestArea,
  type CitizenshipStatus,
  type Ethnicity,
  type EducationLevel,
  type IncomeRange,
  type AgeRange,
} from "@/lib/civicProfileOptions";
import { US_CITIES } from "@/lib/usCities";

type Step = "required" | "optional";

export default function OnboardingForm() {
  const router = useRouter();
  const { update } = useSession();
  const headingRef = useRef<HTMLHeadingElement>(null);

  const [step, setStep] = useState<Step>("required");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [interestAreas, setInterestAreas] = useState<InterestArea[]>([]);

  const [citizenshipStatus, setCitizenshipStatus] =
    useState<CitizenshipStatus>();
  const [ethnicity, setEthnicity] = useState<Ethnicity[]>([]);
  const [educationLevel, setEducationLevel] = useState<EducationLevel>();
  const [incomeRange, setIncomeRange] = useState<IncomeRange>();
  const [ageRange, setAgeRange] = useState<AgeRange>();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requiredValid =
    state.length > 0 && city.trim().length > 0 && interestAreas.length > 0;

  function toggleInterest(value: InterestArea) {
    setInterestAreas((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  function toggleEthnicity(value: Ethnicity) {
    setEthnicity((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  // The heading stays mounted across both steps (only the fields below it
  // swap), so focusing it right after setStep moves keyboard/screen-reader
  // attention to the new step without waiting for a re-render.
  function goToStep(next: Step) {
    setStep(next);
    headingRef.current?.focus();
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state,
          city,
          interestAreas,
          citizenshipStatus,
          ethnicity: ethnicity.length ? ethnicity : undefined,
          educationLevel,
          incomeRange,
          ageRange,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      await update({ hasProfile: true });
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-24">
      <FadeIn immediate>
        <p className="text-sm font-bold uppercase tracking-widest text-stone" aria-live="polite">
          {step === "required" ? "Step 1 of 2" : "Step 2 of 2"}
        </p>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="mt-3 font-display text-3xl font-bold leading-[1.1] tracking-tight outline-none sm:text-5xl"
        >
          {step === "required"
            ? "So we can show you what actually matters to you"
            : "A little more, if you're comfortable"}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone">
          {step === "required"
            ? "Tell us a little about yourself — this is how we find the legislation that actually affects you."
            : "Every field below is optional. Leave anything blank you'd rather not share."}
        </p>
      </FadeIn>

      {step === "required" ? (
        <div className="mt-10 space-y-8">
          <Field id="state" label="State of residence" required>
            <select
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
              aria-required="true"
              className="w-full rounded-xl border border-stone/20 bg-white/70 px-4 py-3 text-base text-charcoal focus:border-royal focus:outline-none focus:ring-2 focus:ring-royal/40"
            >
              <option value="" disabled>
                Select your state
              </option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>

          <Field id="city" label="City or county" required>
            <input
              id="city"
              type="text"
              list="city-suggestions"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Austin"
              required
              aria-required="true"
              className="w-full rounded-xl border border-stone/20 bg-white/70 px-4 py-3 text-base text-charcoal focus:border-royal focus:outline-none focus:ring-2 focus:ring-royal/40"
            />
            <datalist id="city-suggestions">
              {US_CITIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>

          <Field id="interest-areas" label="Interest areas" required hint="Select at least one." asGroup>
            <div className="flex flex-wrap gap-2">
              {INTEREST_AREAS.map(({ value, label }) => {
                const active = interestAreas.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleInterest(value)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-royal text-white"
                        : "bg-white/70 text-stone hover:text-royal"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </Field>

          <div className="pt-4">
            <button
              type="button"
              disabled={!requiredValid}
              onClick={() => goToStep("optional")}
              className="w-full rounded-full bg-royal px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-royal-deep disabled:cursor-not-allowed disabled:bg-stone/30"
            >
              Continue
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-10 space-y-8">
          <SensitiveField
            id="citizenship"
            label="Citizenship status"
            why="Some federal programs and rights vary by immigration status. This helps us surface only what applies to you."
          >
            <ChipGroup
              options={CITIZENSHIP_STATUS_OPTIONS}
              value={citizenshipStatus}
              onChange={setCitizenshipStatus}
            />
          </SensitiveField>

          <SensitiveField
            id="ethnicity"
            label="Ethnicity / racial identity"
            why="Some legislation and programs affect communities differently. This helps us flag when a bill is especially relevant to you."
          >
            <div className="flex flex-wrap gap-2">
              {ETHNICITY_OPTIONS.map(({ value, label }) => {
                const active = ethnicity.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleEthnicity(value)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-royal text-white"
                        : "bg-white/70 text-stone hover:text-royal"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </SensitiveField>

          <SensitiveField
            id="education"
            label="Education level"
            why="Some policy, like student loan legislation, applies differently depending on education level."
          >
            <ChipGroup
              options={EDUCATION_LEVEL_OPTIONS}
              value={educationLevel}
              onChange={setEducationLevel}
            />
          </SensitiveField>

          <SensitiveField
            id="income"
            label="Household income range"
            why="Many bills — like tax changes or benefit programs — only apply above or below certain income thresholds."
          >
            <ChipGroup
              options={INCOME_RANGE_OPTIONS}
              value={incomeRange}
              onChange={setIncomeRange}
            />
          </SensitiveField>

          <SensitiveField
            id="age"
            label="Age range"
            why="Some legislation, like Social Security or veterans' benefits, is only relevant to specific age groups."
          >
            <ChipGroup
              options={AGE_RANGE_OPTIONS}
              value={ageRange}
              onChange={setAgeRange}
            />
          </SensitiveField>

          {error && (
            <p role="alert" className="text-sm font-semibold text-orange">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => goToStep("required")}
              className="rounded-full px-6 py-3 text-base font-semibold text-stone hover:text-royal"
            >
              Back
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="flex-1 rounded-full bg-royal px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-royal-deep disabled:cursor-not-allowed disabled:bg-stone/30"
            >
              {submitting ? "Saving…" : "Finish"}
            </button>
          </div>
        </div>
      )}

      <p className="mt-10 text-sm leading-relaxed text-stone">
        Your information is stored securely and used only to personalize
        your dashboard. Read our{" "}
        <Link href="/privacy" className="font-semibold text-royal hover:text-royal-deep">
          Privacy Policy
        </Link>{" "}
        for exactly what&apos;s collected and how it&apos;s handled.
      </p>
    </div>
  );
}

function Field({
  id,
  label,
  required,
  hint,
  asGroup,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  asGroup?: boolean;
  children: ReactNode;
}) {
  const labelId = `${id}-label`;
  const requiredMark = required && (
    <>
      <span aria-hidden="true" className="text-orange">
        {" "}
        *
      </span>
      <span className="sr-only"> (required)</span>
    </>
  );

  return (
    <div>
      {asGroup ? (
        <span id={labelId} className="block text-sm font-bold text-charcoal">
          {label}
          {requiredMark}
        </span>
      ) : (
        <label htmlFor={id} className="block text-sm font-bold text-charcoal">
          {label}
          {requiredMark}
        </label>
      )}
      {hint && <p className="mt-1 text-sm text-stone">{hint}</p>}
      <div className="mt-2" role={asGroup ? "group" : undefined} aria-labelledby={asGroup ? labelId : undefined}>
        {children}
      </div>
    </div>
  );
}

function SensitiveField({
  id,
  label,
  why,
  children,
}: {
  id: string;
  label: string;
  why: string;
  children: ReactNode;
}) {
  const labelId = `${id}-label`;
  const whyId = `${id}-why`;

  return (
    <div>
      <span id={labelId} className="block text-sm font-bold text-charcoal">
        {label}
      </span>
      <p id={whyId} className="mt-1 text-sm text-stone">
        {why}
      </p>
      <div className="mt-2" role="group" aria-labelledby={labelId} aria-describedby={whyId}>
        {children}
      </div>
    </div>
  );
}

function ChipGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly { value: T; label: string }[];
  value: T | undefined;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              active
                ? "bg-royal text-white"
                : "bg-white/70 text-stone hover:text-royal"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
