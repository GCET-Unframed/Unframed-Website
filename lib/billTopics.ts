import "server-only";
import { INTEREST_AREAS, type InterestArea } from "@/lib/civicProfileOptions";

// Keyword lookup used to map free-text subjects/titles from LegiScan and
// Congress.gov — neither of which shares our interest-area taxonomy — onto
// the fixed InterestArea set collected during onboarding.
const TOPIC_KEYWORDS: Record<InterestArea, string[]> = {
  housing: ["housing", "rent", "tenant", "landlord", "eviction", "zoning", "homeless"],
  healthcare: ["health", "medicaid", "medicare", "insurance", "hospital", "mental health"],
  education: ["education", "school", "student", "tuition", "college", "university", "financial aid"],
  immigration: ["immigration", "visa", "asylum", "daca", "border", "refugee", "deportation"],
  environment: ["environment", "climate", "emission", "pollution", "clean energy", "conservation"],
  labor: ["labor", "employment", "wage", "workplace", "union", "worker"],
  criminal_justice: ["criminal justice", "police", "sentencing", "incarceration", "prison", "bail"],
  taxation: ["tax", "taxation", "revenue", "irs"],
  reproductive_rights: ["abortion", "reproductive", "contraception", "pregnancy"],
  social_security: ["social security", "retirement benefit", "ssi", "ssdi"],
  veterans_affairs: ["veteran", "military benefit", "va health", "veterans affairs"],
};

/** Maps a bill's raw subjects/title/summary text to our InterestArea set. */
export function matchTopics(texts: string[]): InterestArea[] {
  const haystack = texts.join(" ").toLowerCase();
  const matched: InterestArea[] = [];
  for (const { value } of INTEREST_AREAS) {
    if (TOPIC_KEYWORDS[value].some((keyword) => haystack.includes(keyword))) {
      matched.push(value);
    }
  }
  return matched;
}

/** Search terms to query each source with, per interest area. */
export function searchTermsFor(area: InterestArea): string[] {
  return TOPIC_KEYWORDS[area];
}
