import type { InterestArea } from "@/lib/civicProfileOptions";

export type BiasLevel = "minimal" | "low" | "moderate" | "high";

export interface BiasDistribution {
  minimal: number;
  low: number;
  moderate: number;
  high: number;
}

export type TopicCounts = Partial<Record<InterestArea, number>>;

/** Body the Ellipsis extension POSTs to /api/digest. */
export interface WeeklyDigestPayload {
  weekOf: string; // ISO date (Monday), e.g. "2026-07-13"
  articlesAnalyzed: number;
  biasDistribution: BiasDistribution;
  topTopics: TopicCounts;
  sourceCount: number;
}

/** A stored WeeklyReadingDigest row. */
export interface WeeklyReadingDigestRecord {
  userId: string;
  weekOf: string;
  articlesAnalyzed: number;
  biasDistribution: BiasDistribution;
  topTopics: TopicCounts;
  sourceCount: number;
  insightText: string;
  updatedAt: string;
}
