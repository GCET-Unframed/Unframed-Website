"use client";

import { useState } from "react";
import BillChat from "./BillChat";
import { INTEREST_AREAS } from "@/lib/civicProfileOptions";
import type { ScoredBill } from "@/types/bills";

const STATUS_LABELS: Record<ScoredBill["status"], string> = {
  introduced: "Introduced",
  in_committee: "In Committee",
  passed_chamber: "Passed Chamber",
  signed_into_law: "Signed into Law",
  vetoed: "Vetoed",
  failed: "Failed",
  unknown: "Status Unknown",
};

// Reuses only Unframed's existing color tokens — no new hues — mapped from
// "not yet law" (neutral) through "passed" (royal) to "stalled" (orange).
const STATUS_STYLES: Record<ScoredBill["status"], string> = {
  introduced: "bg-stone/10 text-stone",
  in_committee: "bg-stone/10 text-stone",
  passed_chamber: "bg-royal-soft text-royal-deep",
  signed_into_law: "bg-royal text-white",
  vetoed: "bg-orange-soft text-orange",
  failed: "bg-orange-soft text-orange",
  unknown: "bg-stone/10 text-stone",
};

function topicLabel(value: string): string {
  return INTEREST_AREAS.find((a) => a.value === value)?.label ?? value;
}

function formatDate(iso: string | null): string {
  if (!iso) return "Unknown";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BillCard({
  bill,
  saved,
  onSave,
  onDismiss,
}: {
  bill: ScoredBill;
  saved: boolean;
  onSave: () => void;
  onDismiss: () => void;
}) {
  const [chatOpen, setChatOpen] = useState(false);
  const primaryTopic = bill.subjects[0];

  return (
    <div className="rounded-3xl border border-stone/15 bg-white/70 p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLES[bill.status]}`}>
          {STATUS_LABELS[bill.status]}
        </span>
        {primaryTopic && (
          <span className="rounded-full bg-sky-soft px-3 py-1 text-xs font-bold text-royal-deep">
            {topicLabel(primaryTopic)}
          </span>
        )}
        <span className="rounded-full bg-stone/10 px-3 py-1 text-xs font-bold text-stone">
          {bill.scope === "state" ? bill.state : "Federal"}
        </span>
        <span className="ml-auto text-xs text-stone">{bill.billNumber}</span>
      </div>

      <h3 className="mt-3 font-serif text-xl font-semibold leading-snug tracking-tight text-charcoal">
        {bill.title}
      </h3>

      <div className="mt-4 space-y-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-stone">What it does</p>
          <p className="mt-1 text-[15px] leading-relaxed text-charcoal">{bill.summary}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-stone">Why it matters to you</p>
          <p className="mt-1 text-[15px] leading-relaxed text-orange">{bill.relevanceReason}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-stone">
        <div className="flex items-center gap-4">
          <span>Last updated {formatDate(bill.lastActionDate)}</span>
          <a
            href={bill.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-royal hover:text-royal-deep"
          >
            Full bill text ↗<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-pressed={saved}
            onClick={onSave}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              saved
                ? "bg-royal text-white"
                : "bg-white/70 text-stone hover:text-royal"
            }`}
          >
            {saved ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-full px-4 py-1.5 text-sm font-semibold text-stone hover:text-orange"
          >
            Dismiss
          </button>
        </div>
      </div>

      <div className="mt-4 border-t border-stone/10 pt-4">
        <button
          type="button"
          aria-expanded={chatOpen}
          onClick={() => setChatOpen((open) => !open)}
          className="text-xs font-bold uppercase tracking-wide text-stone hover:text-royal"
        >
          {chatOpen ? "Hide chat ▲" : "Ask about this bill ▼"}
        </button>
        {chatOpen && (
          <div className="mt-3">
            <BillChat
              bill={{
                title: bill.title,
                summary: bill.summary,
                status: STATUS_LABELS[bill.status],
                relevanceReason: bill.relevanceReason,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
