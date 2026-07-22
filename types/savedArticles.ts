export interface BiasMetric {
  score: number | null;
  confidence: number;
  evidenceCount: number;
  status: "assessed" | "insufficient-evidence";
}

export interface BiasScores {
  political_bias: BiasMetric;
  gender_bias: BiasMetric;
  ethnicity_bias: BiasMetric;
  class_bias: BiasMetric;
}

export interface ArticlePerspective {
  displayName: string;
  entityType: string;
  contributionSummary: string;
  [key: string]: unknown;
}

export interface FramingNote {
  text: string;
  confidenceScore: number;
  confidenceLabel: string;
  [key: string]: unknown;
}

/** Body the Ellipsis extension POSTs to /api/saved-articles. */
export interface SavedArticlePayload {
  articleUrl: string;
  articleTitle: string;
  savedAt: string;
  biasScores: BiasScores;
  perspectives: ArticlePerspective[];
  framingNotes: FramingNote[];
  summary: string;
}

/** A stored SavedArticle row. */
export interface SavedArticleRecord {
  userId: string;
  articleUrl: string;
  articleTitle: string;
  savedAt: string;
  biasScores: BiasScores;
  perspectives: ArticlePerspective[];
  framingNotes: FramingNote[];
  summary: string;
  syncedAt: string;
}
