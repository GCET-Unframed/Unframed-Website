"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface SavedBillRow {
  userId: string;
  billId: string;
  billTitle: string;
  savedAt: string;
  dismissed: boolean;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function SavedLegislation() {
  const [bills, setBills] = useState<SavedBillRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadSavedBills() {
    const res = await fetch("/api/saved-bills");
    if (!res.ok) return;
    const data: { savedBills: SavedBillRow[] } = await res.json();
    setBills(data.savedBills.filter((bill) => !bill.dismissed));
  }

  useEffect(() => {
    loadSavedBills().finally(() => setLoading(false));
  }, []);

  async function unsaveBill(billId: string, billTitle: string) {
    const res = await fetch("/api/saved-bills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ billId, billTitle, action: "dismiss" }),
    });
    if (res.ok) setBills((current) => current.filter((bill) => bill.billId !== billId));
  }

  if (loading) {
    return <p className="text-stone">Loading saved legislation…</p>;
  }

  if (bills.length === 0) {
    return (
      <div className="rounded-2xl border border-stone/15 bg-white/70 p-8 text-center">
        <p className="text-lg font-semibold text-charcoal">No saved bills yet</p>
        <p className="mt-2 text-stone">
          Save a bill from your{" "}
          <Link href="/dashboard/bills" className="font-semibold text-royal hover:text-royal-deep">
            legislation feed
          </Link>{" "}
          to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bills.map((bill) => (
        <div
          key={bill.billId}
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone/15 bg-white/70 p-5"
        >
          <div>
            <p className="font-serif text-base font-semibold leading-snug text-charcoal">{bill.billTitle}</p>
            <p className="mt-1 text-xs text-stone">Saved {formatDate(bill.savedAt)}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/bills" className="text-sm font-semibold text-royal hover:text-royal-deep">
              View in feed
            </Link>
            <button
              type="button"
              onClick={() => unsaveBill(bill.billId, bill.billTitle)}
              className="rounded-full px-4 py-1.5 text-sm font-semibold text-stone hover:text-orange"
            >
              Unsave
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
