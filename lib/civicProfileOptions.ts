export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine",
  "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia",
  "Washington", "West Virginia", "Wisconsin", "Wyoming",
  "District of Columbia",
] as const;

export const INTEREST_AREAS = [
  { value: "housing", label: "Housing" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "immigration", label: "Immigration" },
  { value: "environment", label: "Environment" },
  { value: "labor", label: "Labor" },
  { value: "criminal_justice", label: "Criminal Justice" },
  { value: "taxation", label: "Taxation" },
  { value: "reproductive_rights", label: "Reproductive Rights" },
  { value: "social_security", label: "Social Security" },
  { value: "veterans_affairs", label: "Veterans' Affairs" },
] as const;

export const CITIZENSHIP_STATUS_OPTIONS = [
  { value: "us_citizen", label: "U.S. citizen" },
  { value: "permanent_resident", label: "Permanent resident" },
  { value: "daca_undocumented", label: "DACA / undocumented" },
  { value: "visa_holder", label: "Visa holder" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
] as const;

export const ETHNICITY_OPTIONS = [
  { value: "american_indian_alaska_native", label: "American Indian or Alaska Native" },
  { value: "asian", label: "Asian" },
  { value: "black_african_american", label: "Black or African American" },
  { value: "hispanic_latino", label: "Hispanic or Latino" },
  { value: "native_hawaiian_pacific_islander", label: "Native Hawaiian or Other Pacific Islander" },
  { value: "white", label: "White" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
] as const;

export const EDUCATION_LEVEL_OPTIONS = [
  { value: "high_school", label: "High school" },
  { value: "some_college", label: "Some college" },
  { value: "bachelors", label: "Bachelor's" },
  { value: "graduate", label: "Graduate" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
] as const;

export const INCOME_RANGE_OPTIONS = [
  { value: "below_30k", label: "Below $30k" },
  { value: "30k_60k", label: "$30k–$60k" },
  { value: "60k_100k", label: "$60k–$100k" },
  { value: "100k_plus", label: "$100k+" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
] as const;

export const AGE_RANGE_OPTIONS = [
  { value: "under_18", label: "Under 18" },
  { value: "18_24", label: "18–24" },
  { value: "25_34", label: "25–34" },
  { value: "35_49", label: "35–49" },
  { value: "50_64", label: "50–64" },
  { value: "65_plus", label: "65+" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
] as const;

export type InterestArea = (typeof INTEREST_AREAS)[number]["value"];
export type CitizenshipStatus = (typeof CITIZENSHIP_STATUS_OPTIONS)[number]["value"];
export type Ethnicity = (typeof ETHNICITY_OPTIONS)[number]["value"];
export type EducationLevel = (typeof EDUCATION_LEVEL_OPTIONS)[number]["value"];
export type IncomeRange = (typeof INCOME_RANGE_OPTIONS)[number]["value"];
export type AgeRange = (typeof AGE_RANGE_OPTIONS)[number]["value"];

export interface CivicProfileInput {
  state: string;
  city: string;
  interestAreas: InterestArea[];
  citizenshipStatus?: CitizenshipStatus;
  ethnicity?: Ethnicity[];
  educationLevel?: EducationLevel;
  incomeRange?: IncomeRange;
  ageRange?: AgeRange;
}

const valueSet = <T extends { value: string }>(options: readonly T[]) =>
  new Set(options.map((o) => o.value));

const interestAreaValues = valueSet(INTEREST_AREAS);
const citizenshipStatusValues = valueSet(CITIZENSHIP_STATUS_OPTIONS);
const ethnicityValues = valueSet(ETHNICITY_OPTIONS);
const educationLevelValues = valueSet(EDUCATION_LEVEL_OPTIONS);
const incomeRangeValues = valueSet(INCOME_RANGE_OPTIONS);
const ageRangeValues = valueSet(AGE_RANGE_OPTIONS);

export function validateCivicProfileInput(
  body: unknown
): { ok: true; data: CivicProfileInput } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Request body must be an object." };
  }
  const b = body as Record<string, unknown>;

  if (typeof b.state !== "string" || !US_STATES.includes(b.state as (typeof US_STATES)[number])) {
    return { ok: false, error: "state must be a valid U.S. state." };
  }
  if (typeof b.city !== "string" || b.city.trim().length === 0) {
    return { ok: false, error: "city is required." };
  }
  if (
    !Array.isArray(b.interestAreas) ||
    b.interestAreas.length === 0 ||
    !b.interestAreas.every((v) => typeof v === "string" && interestAreaValues.has(v))
  ) {
    return { ok: false, error: "interestAreas must include at least one valid value." };
  }
  if (
    b.citizenshipStatus !== undefined &&
    (typeof b.citizenshipStatus !== "string" || !citizenshipStatusValues.has(b.citizenshipStatus))
  ) {
    return { ok: false, error: "citizenshipStatus is invalid." };
  }
  if (
    b.ethnicity !== undefined &&
    (!Array.isArray(b.ethnicity) ||
      !b.ethnicity.every((v) => typeof v === "string" && ethnicityValues.has(v)))
  ) {
    return { ok: false, error: "ethnicity is invalid." };
  }
  if (
    b.educationLevel !== undefined &&
    (typeof b.educationLevel !== "string" || !educationLevelValues.has(b.educationLevel))
  ) {
    return { ok: false, error: "educationLevel is invalid." };
  }
  if (
    b.incomeRange !== undefined &&
    (typeof b.incomeRange !== "string" || !incomeRangeValues.has(b.incomeRange))
  ) {
    return { ok: false, error: "incomeRange is invalid." };
  }
  if (
    b.ageRange !== undefined &&
    (typeof b.ageRange !== "string" || !ageRangeValues.has(b.ageRange))
  ) {
    return { ok: false, error: "ageRange is invalid." };
  }

  return {
    ok: true,
    data: {
      state: b.state,
      city: (b.city as string).trim(),
      interestAreas: b.interestAreas as InterestArea[],
      citizenshipStatus: b.citizenshipStatus as CitizenshipStatus | undefined,
      ethnicity: b.ethnicity as Ethnicity[] | undefined,
      educationLevel: b.educationLevel as EducationLevel | undefined,
      incomeRange: b.incomeRange as IncomeRange | undefined,
      ageRange: b.ageRange as AgeRange | undefined,
    },
  };
}
