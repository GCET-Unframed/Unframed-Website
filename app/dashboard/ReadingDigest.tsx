"use client";

import { useCallback, useEffect, useState } from "react";
import BiasSpectrumBar from "./BiasSpectrumBar";
import { INTEREST_AREAS } from "@/lib/civicProfileOptions";
import type { WeeklyDigestPayload, WeeklyReadingDigestRecord } from "@/types/digest";

const EXTENSION_ID = process.env.NEXT_PUBLIC_ELLIPSIS_EXTENSION_ID;
const ELLIPSIS_REPO_URL = "https://github.com/sleepsyah/CMU";

interface PendingDigestFromExtension {
  weekOf: string;
  articlesAnalyzed: number;
  biasLevelCounts: WeeklyDigestPayload["biasDistribution"];
  topicCounts: WeeklyDigestPayload["topTopics"];
  sourceCount: number;
}

interface RequestDigestResponse {
  connected: boolean;
  pendingDigest: PendingDigestFromExtension | null;
}

// Minimal shape of the chrome.runtime messaging API the browser injects into
// this page when Ellipsis is installed and unframed.co is in its
// externally_connectable list. Declared locally instead of pulling in
// @types/chrome, which this project (a plain web app, not an extension)
// doesn't otherwise need.
interface ExternallyConnectableRuntime {
  lastError?: { message?: string };
  sendMessage(
    extensionId: string,
    message: unknown,
    responseCallback: (response?: unknown) => void
  ): void;
}

function topicLabel(value: string): string {
  return INTEREST_AREAS.find((a) => a.value === value)?.label ?? value;
}

function formatWeekOf(weekOf: string): string {
  const monday = new Date(`${weekOf}T00:00:00`);
  const sunday = new Date(monday.getTime() + 6 * 86_400_000);
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(monday)} – ${fmt(sunday)}`;
}

// The extension only exposes chrome.runtime.sendMessage to this page if
// Ellipsis is installed and this origin is in its externally_connectable
// list — so a failed/missing response means "not installed," not an error.
function getExtensionRuntime(): ExternallyConnectableRuntime | undefined {
  return (window as unknown as { chrome?: { runtime?: ExternallyConnectableRuntime } }).chrome?.runtime;
}

function requestPendingDigest(): Promise<RequestDigestResponse | null> {
  return new Promise((resolve) => {
    const runtime = getExtensionRuntime();
    if (!EXTENSION_ID || !runtime?.sendMessage) {
      resolve(null);
      return;
    }
    try {
      runtime.sendMessage(EXTENSION_ID, { type: "ellipsis.requestDigest" }, (response) => {
        if (runtime.lastError || !response) {
          resolve(null);
          return;
        }
        resolve(response as RequestDigestResponse);
      });
    } catch {
      resolve(null);
    }
  });
}

function confirmExtensionSync(weekOf: string): Promise<void> {
  return new Promise((resolve) => {
    const runtime = getExtensionRuntime();
    if (!EXTENSION_ID || !runtime?.sendMessage) {
      resolve();
      return;
    }
    try {
      runtime.sendMessage(EXTENSION_ID, { type: "ellipsis.confirmSync", weekOf }, () => resolve());
    } catch {
      resolve();
    }
  });
}

export default function ReadingDigest() {
  const [digests, setDigests] = useState<WeeklyReadingDigestRecord[]>([]);
  const [weekIndex, setWeekIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [extensionInstalled, setExtensionInstalled] = useState<boolean | null>(null);

  const loadDigests = useCallback(async () => {
    const res = await fetch("/api/digest?limit=8");
    if (!res.ok) return;
    const data: { digests: WeeklyReadingDigestRecord[] } = await res.json();
    setDigests(data.digests);
    setWeekIndex(0);
  }, []);

  useEffect(() => {
    (async () => {
      await loadDigests();
      setLoading(false);

      const result = await requestPendingDigest();
      setExtensionInstalled(result !== null);
      if (result?.pendingDigest) {
        const payload: WeeklyDigestPayload = {
          weekOf: result.pendingDigest.weekOf,
          articlesAnalyzed: result.pendingDigest.articlesAnalyzed,
          biasDistribution: result.pendingDigest.biasLevelCounts,
          topTopics: result.pendingDigest.topicCounts,
          sourceCount: result.pendingDigest.sourceCount,
        };
        const syncRes = await fetch("/api/digest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (syncRes.ok) {
          await confirmExtensionSync(payload.weekOf);
          await loadDigests();
        }
      }
    })();
  }, [loadDigests]);

  if (loading) {
    return <p className="text-stone">Loading your reading digest…</p>;
  }

  if (digests.length === 0) {
    if (extensionInstalled === false) {
      return (
        <div className="rounded-2xl border border-stone/15 bg-white/70 p-8 text-center">
          <p className="text-lg font-semibold text-charcoal">Ellipsis isn&apos;t connected yet</p>
          <p className="mt-2 text-stone">
            Ellipsis surfaces bias signals and framing as you read the news, then syncs an
            anonymous weekly summary here — no article content ever leaves your device.
            It isn&apos;t on the Chrome Web Store yet, so install it from source for now.
          </p>
          <a
            href={ELLIPSIS_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-full bg-royal px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-royal-deep"
          >
            Get Ellipsis
          </a>
        </div>
      );
    }
    return (
      <div className="rounded-2xl border border-stone/15 bg-white/70 p-8 text-center">
        <p className="text-lg font-semibold text-charcoal">No reading digest yet</p>
        <p className="mt-2 text-stone">
          Analyze a few articles with Ellipsis this week and your digest will sync here.
        </p>
      </div>
    );
  }

  const digest = digests[weekIndex];
  const topTopics = Object.entries(digest.topTopics)
    .filter(([, count]) => (count ?? 0) > 0)
    .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))
    .slice(0, 5);
  const topTopicMax = topTopics[0]?.[1] ?? 1;

  return (
    <div className="rounded-2xl border border-stone/15 bg-white/70 p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-stone">Reading Digest</p>
          <h3 className="mt-1 font-display text-xl font-bold tracking-tight">{formatWeekOf(digest.weekOf)}</h3>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            disabled={weekIndex >= digests.length - 1}
            onClick={() => setWeekIndex((i) => i + 1)}
            className="rounded-full px-3 py-1.5 text-sm font-semibold text-stone hover:text-royal disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Previous week"
          >
            ← Prev
          </button>
          <button
            type="button"
            disabled={weekIndex <= 0}
            onClick={() => setWeekIndex((i) => i - 1)}
            className="rounded-full px-3 py-1.5 text-sm font-semibold text-stone hover:text-royal disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Next week"
          >
            Next →
          </button>
        </div>
      </div>

      <p className="mt-4 text-base leading-relaxed text-charcoal">{digest.insightText}</p>

      <div className="mt-5 grid grid-cols-2 gap-4 text-sm text-stone sm:grid-cols-3">
        <div>
          <p className="text-2xl font-bold text-charcoal">{digest.articlesAnalyzed}</p>
          <p>Articles analyzed</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-charcoal">{digest.sourceCount}</p>
          <p>Distinct sources</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-bold text-charcoal">Bias-cue strength</p>
        <div className="mt-2">
          <BiasSpectrumBar distribution={digest.biasDistribution} />
        </div>
      </div>

      {topTopics.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-bold text-charcoal">Top topics</p>
          <div className="mt-2 space-y-2">
            {topTopics.map(([topic, count]) => (
              <div key={topic} className="flex items-center gap-3">
                <span className="w-32 shrink-0 text-sm text-stone">{topicLabel(topic)}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone/10">
                  <div
                    className="h-full rounded-full bg-royal"
                    style={{ width: `${((count ?? 0) / topTopicMax) * 100}%` }}
                  />
                </div>
                <span className="w-6 shrink-0 text-right text-sm text-stone">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
