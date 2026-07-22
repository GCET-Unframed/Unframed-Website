"use client";

import { useEffect, useState } from "react";
import type { BiasMetric, BiasScores, SavedArticleRecord } from "@/types/savedArticles";

const DIMENSIONS: { key: keyof BiasScores; label: string }[] = [
  { key: "political_bias", label: "Political" },
  { key: "gender_bias", label: "Gender" },
  { key: "ethnicity_bias", label: "Ethnicity" },
  { key: "class_bias", label: "Class" },
];

function tone(score: number | null): "low" | "moderate" | "high" | "neutral" {
  if (score === null) return "neutral";
  if (score < 34) return "low";
  if (score < 67) return "moderate";
  return "high";
}

const TONE_BAR_CLASS: Record<string, string> = {
  low: "bg-royal-soft",
  moderate: "bg-royal",
  high: "bg-orange",
  neutral: "bg-stone/20",
};

const TONE_TEXT_CLASS: Record<string, string> = {
  low: "text-royal-deep",
  moderate: "text-royal-deep",
  high: "text-orange",
  neutral: "text-stone",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function highlightFor(article: SavedArticleRecord): string {
  const firstNote = article.framingNotes[0]?.text;
  if (firstNote) return firstNote;
  const firstSentence = article.summary.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim();
  return firstSentence || article.summary;
}

function BiasMetricRow({ label, metric }: { label: string; metric: BiasMetric }) {
  const score = metric.status === "assessed" && metric.score !== null ? Math.round(metric.score) : null;
  const level = tone(score);
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-20 shrink-0 text-stone">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone/10">
        {score !== null && <div className={`h-full rounded-full ${TONE_BAR_CLASS[level]}`} style={{ width: `${score}%` }} />}
      </div>
      <span className={`w-20 shrink-0 text-right text-xs font-semibold ${TONE_TEXT_CLASS[level]}`}>
        {score === null ? "No evidence" : `${score}/100`}
      </span>
    </div>
  );
}

function ArticleCard({ article, onDelete }: { article: SavedArticleRecord; onDelete: (articleUrl: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const scored = DIMENSIONS.map(({ key, label }) => ({ label, metric: article.biasScores[key] }))
    .filter(({ metric }) => metric.status === "assessed" && metric.score !== null);
  const summaryLabel = scored.length
    ? scored.map(({ label, metric }) => `${label} ${Math.round(metric.score ?? 0)}`).join(" · ")
    : "No bias cues detected";

  return (
    <div className="rounded-3xl border border-stone/15 bg-white/70 p-6 shadow-sm">
      <button type="button" className="w-full text-left" aria-expanded={expanded} onClick={() => setExpanded((open) => !open)}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="font-serif text-lg font-semibold leading-snug tracking-tight text-charcoal">
            {article.articleTitle}
          </h3>
          <span className="shrink-0 text-xs text-stone">{formatDate(article.savedAt)}</span>
        </div>
        <p className="mt-2 text-[15px] leading-relaxed text-charcoal">{highlightFor(article)}</p>
        <p className="mt-2 text-xs font-semibold text-stone">{summaryLabel}</p>
      </button>

      {expanded && (
        <div className="mt-5 space-y-5 border-t border-stone/10 pt-5">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wide text-stone">Bias breakdown</p>
            {DIMENSIONS.map(({ key, label }) => (
              <BiasMetricRow key={key} label={label} metric={article.biasScores[key]} />
            ))}
          </div>

          {article.perspectives.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-stone">Perspectives</p>
              <ul className="mt-2 space-y-2">
                {article.perspectives.map((perspective, index) => (
                  <li key={index} className="rounded-xl bg-stone/5 p-3 text-sm">
                    <p className="font-semibold text-charcoal">{perspective.displayName}</p>
                    <p className="mt-1 text-stone">{perspective.contributionSummary}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {article.framingNotes.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-stone">Framing notes</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-charcoal">
                {article.framingNotes.map((note, index) => (
                  <li key={index}>{note.text}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-stone">Summary</p>
            <p className="mt-1 text-[15px] leading-relaxed text-charcoal">{article.summary}</p>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <a
              href={article.articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-royal hover:text-royal-deep"
            >
              Read the article ↗<span className="sr-only"> (opens in a new tab)</span>
            </a>
            <button
              type="button"
              onClick={() => onDelete(article.articleUrl)}
              className="rounded-full px-4 py-1.5 text-sm font-semibold text-stone hover:text-orange"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SavedArticles() {
  const [articles, setArticles] = useState<SavedArticleRecord[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadArticles() {
    const res = await fetch("/api/saved-articles");
    if (!res.ok) return;
    const data: { savedArticles: SavedArticleRecord[] } = await res.json();
    setArticles(data.savedArticles);
  }

  useEffect(() => {
    loadArticles().finally(() => setLoading(false));
  }, []);

  async function deleteArticle(articleUrl: string) {
    const res = await fetch(`/api/saved-articles?articleUrl=${encodeURIComponent(articleUrl)}`, { method: "DELETE" });
    if (res.ok) setArticles((current) => current.filter((article) => article.articleUrl !== articleUrl));
  }

  if (loading) {
    return <p className="text-stone">Loading saved articles…</p>;
  }

  if (articles.length === 0) {
    return (
      <div className="rounded-2xl border border-stone/15 bg-white/70 p-8 text-center">
        <p className="text-lg font-semibold text-charcoal">No saved articles yet</p>
        <p className="mt-2 text-stone">
          Turn on saved-article syncing in Ellipsis&apos;s Unframed sync settings, then save an
          analysis there to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <ArticleCard key={article.articleUrl} article={article} onDelete={deleteArticle} />
      ))}
    </div>
  );
}
