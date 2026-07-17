"use client";

import { useCallback, useEffect, useState } from "react";
import BillCard from "./BillCard";
import { INTEREST_AREAS, type InterestArea } from "@/lib/civicProfileOptions";
import type { BillsFeedResponse, ScoredBill } from "@/types/bills";

type Scope = "state" | "federal" | "all";

const SCOPE_LABELS: Record<Scope, string> = {
  state: "My State",
  federal: "Federal",
  all: "All",
};

export default function BillFeed({
  userState,
  defaultTopics,
}: {
  userState: string;
  defaultTopics: InterestArea[];
}) {
  const [scope, setScope] = useState<Scope>("state");
  const [topics, setTopics] = useState<InterestArea[]>(defaultTopics);
  const [bills, setBills] = useState<ScoredBill[]>([]);
  const [savedBillIds, setSavedBillIds] = useState<Set<string>>(new Set());
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ scope, topics: topics.join(",") });
      const res = await fetch(`/api/bills?${params.toString()}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Couldn't load bills.");
      }
      const data: BillsFeedResponse = await res.json();
      setBills(data.bills);
      setSavedBillIds(new Set(data.savedBillIds));
      setLastRefreshedAt(data.lastRefreshedAt);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't load bills.");
    } finally {
      setLoading(false);
    }
  }, [scope, topics]);

  useEffect(() => {
    loadBills();
  }, [loadBills]);

  function toggleTopic(value: InterestArea) {
    setTopics((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  }

  async function handleSave(bill: ScoredBill) {
    setSavedBillIds((prev) => new Set(prev).add(bill.id));
    await fetch("/api/saved-bills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ billId: bill.id, billTitle: bill.title, action: "save" }),
    });
  }

  async function handleDismiss(bill: ScoredBill) {
    setBills((prev) => prev.filter((b) => b.id !== bill.id));
    await fetch("/api/saved-bills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ billId: bill.id, billTitle: bill.title, action: "dismiss" }),
    });
  }

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-5 border-b border-stone/10 bg-white/80 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {(Object.keys(SCOPE_LABELS) as Scope[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setScope(s)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  scope === s ? "bg-royal text-white" : "bg-white/70 text-stone hover:text-royal"
                }`}
              >
                {s === "state" ? `${SCOPE_LABELS[s]} (${userState})` : SCOPE_LABELS[s]}
              </button>
            ))}
          </div>
          {lastRefreshedAt && (
            <p className="text-xs text-stone">
              Last refreshed {new Date(lastRefreshedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {INTEREST_AREAS.map(({ value, label }) => {
            const active = topics.includes(value);
            return (
              <button
                key={value}
                type="button"
                onClick={() => toggleTopic(value)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  active
                    ? "bg-royal-soft text-royal-deep"
                    : "bg-white/50 text-stone hover:text-royal"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {loading && <p className="text-stone">Loading legislation…</p>}

        {!loading && error && (
          <p className="text-sm font-semibold text-orange-deep">{error}</p>
        )}

        {!loading && !error && bills.length === 0 && (
          <div className="rounded-2xl border border-stone/15 bg-white/70 p-8 text-center">
            <p className="text-lg font-semibold text-charcoal">No bills match right now.</p>
            <p className="mt-2 text-stone">
              Try broadening your topics above, or switch scope to Federal or All.
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          bills.map((bill) => (
            <BillCard
              key={bill.id}
              bill={bill}
              saved={savedBillIds.has(bill.id)}
              onSave={() => handleSave(bill)}
              onDismiss={() => handleDismiss(bill)}
            />
          ))}
      </div>
    </div>
  );
}
