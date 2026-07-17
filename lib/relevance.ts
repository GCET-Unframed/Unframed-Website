import "server-only";
import type { CivicProfileInput, InterestArea } from "@/lib/civicProfileOptions";
import { INTEREST_AREAS } from "@/lib/civicProfileOptions";
import type { Bill, ScoredBill } from "@/types/bills";

const interestLabel = (value: InterestArea) =>
  INTEREST_AREAS.find((a) => a.value === value)?.label ?? value;

interface DemographicRule {
  topic: InterestArea;
  keywords: string[];
  appliesTo: (profile: CivicProfileInput) => boolean;
  reason: (profile: CivicProfileInput) => string;
}

// Illustrative demographic-applicability rules per PLANNING.md §5.3 — e.g.
// "a Medicaid expansion bill is flagged for users who selected healthcare
// and income below $60k." Each rule only fires when its topic is already a
// matched interest area AND the bill's text hints at the narrower subject.
const DEMOGRAPHIC_RULES: DemographicRule[] = [
  {
    topic: "healthcare",
    keywords: ["medicaid", "medicare", "subsidy", "premium"],
    appliesTo: (p) => p.incomeRange === "below_30k" || p.incomeRange === "30k_60k",
    reason: () =>
      "Because your household income is in a lower bracket, this affects the coverage or subsidies available to you.",
  },
  {
    topic: "education",
    keywords: ["student loan", "tuition", "financial aid"],
    appliesTo: (p) =>
      p.educationLevel === "some_college" ||
      p.educationLevel === "bachelors" ||
      p.educationLevel === "graduate",
    reason: () => "This changes student loan or tuition terms that apply to your education level.",
  },
  {
    topic: "immigration",
    keywords: ["immigration", "visa", "asylum", "daca", "deportation"],
    appliesTo: (p) =>
      p.citizenshipStatus === "daca_undocumented" ||
      p.citizenshipStatus === "visa_holder" ||
      p.citizenshipStatus === "permanent_resident",
    reason: () => "This directly affects rights or status tied to your citizenship status.",
  },
  {
    topic: "social_security",
    keywords: ["social security", "retirement"],
    appliesTo: (p) => p.ageRange === "50_64" || p.ageRange === "65_plus",
    reason: () => "This changes Social Security or retirement benefits relevant to your age group.",
  },
  {
    topic: "veterans_affairs",
    keywords: ["veteran", "va health", "military benefit"],
    appliesTo: () => true,
    reason: () => "This affects veterans' benefits or services.",
  },
];

function scoreBill(bill: Bill, profile: CivicProfileInput): ScoredBill | null {
  const matchedTopics = bill.subjects.filter((s) => profile.interestAreas.includes(s));
  if (matchedTopics.length === 0) return null;

  const geoMatch = bill.scope === "federal" || bill.state === profile.state;
  if (!geoMatch) return null;

  let score = matchedTopics.length * 10 + (bill.scope === "state" ? 15 : 5);
  let reason = `Matches your interest in ${interestLabel(matchedTopics[0])}.`;

  const haystack = `${bill.title} ${bill.summary}`.toLowerCase();
  for (const rule of DEMOGRAPHIC_RULES) {
    if (
      matchedTopics.includes(rule.topic) &&
      rule.appliesTo(profile) &&
      rule.keywords.some((k) => haystack.includes(k))
    ) {
      score += 20;
      reason = rule.reason(profile);
      break;
    }
  }

  return { ...bill, relevanceScore: score, relevanceReason: reason };
}

export function scoreAndFilterBills(
  bills: Bill[],
  profile: CivicProfileInput,
  topicOverride?: InterestArea[]
): ScoredBill[] {
  const effectiveProfile = topicOverride
    ? { ...profile, interestAreas: topicOverride }
    : profile;

  return bills
    .map((bill) => scoreBill(bill, effectiveProfile))
    .filter((b): b is ScoredBill => b !== null)
    .sort((a, b) => {
      if (b.relevanceScore !== a.relevanceScore) return b.relevanceScore - a.relevanceScore;
      return (b.lastActionDate ?? "").localeCompare(a.lastActionDate ?? "");
    });
}
