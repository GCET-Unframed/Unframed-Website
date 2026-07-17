import "server-only";
import { INTEREST_AREAS } from "@/lib/civicProfileOptions";
import type { BiasDistribution, TopicCounts } from "@/types/digest";

const LEVEL_ADJECTIVE: Record<keyof BiasDistribution, string> = {
  minimal: "minimal",
  low: "limited",
  moderate: "moderate",
  high: "strong",
};

function topicLabel(value: string): string {
  return INTEREST_AREAS.find((a) => a.value === value)?.label ?? value;
}

function dominantKey<T extends string>(counts: Partial<Record<T, number>>): T | null {
  let best: T | null = null;
  let bestCount = 0;
  for (const [key, count] of Object.entries(counts) as [T, number][]) {
    if (count > bestCount) {
      best = key;
      bestCount = count;
    }
  }
  return best;
}

// Deterministic sentence assembled from the structured aggregate — no LLM
// call, so it's free, instant, and never invents anything not in the data.
export function buildInsightText({
  articlesAnalyzed,
  biasDistribution,
  topTopics,
  sourceCount,
}: {
  articlesAnalyzed: number;
  biasDistribution: BiasDistribution;
  topTopics: TopicCounts;
  sourceCount: number;
}): string {
  if (articlesAnalyzed === 0) {
    return "No articles were analyzed with Ellipsis this week.";
  }

  const topTopicKey = dominantKey(topTopics);
  const dominantLevel = dominantKey(biasDistribution) ?? "minimal";
  const topicPhrase = topTopicKey
    ? `focused heavily on ${topicLabel(topTopicKey).toLowerCase()}`
    : "covered a mix of topics";
  const sourcePhrase = sourceCount === 1 ? "1 source" : `${sourceCount} sources`;

  return `This week, you analyzed ${articlesAnalyzed} article${articlesAnalyzed === 1 ? "" : "s"} across ${sourcePhrase} that ${topicPhrase}, with ${LEVEL_ADJECTIVE[dominantLevel]} bias-cue strength overall.`;
}
