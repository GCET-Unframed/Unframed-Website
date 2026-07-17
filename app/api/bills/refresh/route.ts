import { NextResponse } from "next/server";
import { getSearch, getBill } from "@/lib/legiscan";
import { listRecentBills, getBillDetail, getBillSubjects } from "@/lib/congress";
import { normalizeLegiscanBill, normalizeCongressBill, upsertBills, getDistinctProfileStates } from "@/lib/bills";
import { INTEREST_AREAS } from "@/lib/civicProfileOptions";
import { searchTermsFor, matchTopics } from "@/lib/billTopics";
import type { Bill } from "@/types/bills";

// Current numbered Congress covering the active session (119th = 2025-2026).
const CONGRESS_NUMBER = Number(process.env.CONGRESS_NUMBER) || 119;
const RESULTS_PER_SEARCH = 3;

function stateAbbreviation(stateName: string): string {
  // LegiScan expects two-letter codes; CivicProfile stores full names.
  const entry = Object.entries(STATE_ABBREVIATIONS).find(([name]) => name === stateName);
  return entry?.[1] ?? stateName;
}

const STATE_ABBREVIATIONS: Record<string, string> = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA",
  Colorado: "CO", Connecticut: "CT", Delaware: "DE", Florida: "FL", Georgia: "GA",
  Hawaii: "HI", Idaho: "ID", Illinois: "IL", Indiana: "IN", Iowa: "IA", Kansas: "KS",
  Kentucky: "KY", Louisiana: "LA", Maine: "ME", Maryland: "MD", Massachusetts: "MA",
  Michigan: "MI", Minnesota: "MN", Mississippi: "MS", Missouri: "MO", Montana: "MT",
  Nebraska: "NE", Nevada: "NV", "New Hampshire": "NH", "New Jersey": "NJ",
  "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND",
  Ohio: "OH", Oklahoma: "OK", Oregon: "OR", Pennsylvania: "PA", "Rhode Island": "RI",
  "South Carolina": "SC", "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT",
  Vermont: "VT", Virginia: "VA", Washington: "WA", "West Virginia": "WV",
  Wisconsin: "WI", Wyoming: "WY", "District of Columbia": "DC",
};

async function refreshLegiscanBills(): Promise<Bill[]> {
  const states = await getDistinctProfileStates();
  const bills: Bill[] = [];

  for (const state of states) {
    const abbr = stateAbbreviation(state);
    for (const { value: area } of INTEREST_AREAS) {
      const [term] = searchTermsFor(area);
      const results = await getSearch(abbr, term);
      for (const result of results.slice(0, RESULTS_PER_SEARCH)) {
        const detail = await getBill(result.bill_id);
        bills.push(normalizeLegiscanBill(detail));
      }
    }
  }

  return bills;
}

async function refreshCongressBills(): Promise<Bill[]> {
  const recent = await listRecentBills(CONGRESS_NUMBER, { limit: 50 });
  const bills: Bill[] = [];

  for (const summary of recent) {
    const subjectNames = await getBillSubjects(summary.congress, summary.type, summary.number);
    if (matchTopics(subjectNames).length === 0) continue; // skip bills with no interest-area match

    const detail = await getBillDetail(summary.congress, summary.type, summary.number);
    bills.push(normalizeCongressBill(detail, subjectNames));
  }

  return bills;
}

async function handleRefresh(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [legiscanBills, congressBills] = await Promise.all([
    refreshLegiscanBills(),
    refreshCongressBills(),
  ]);

  const bills = [...legiscanBills, ...congressBills];
  await upsertBills(bills);

  return NextResponse.json({ ok: true, count: bills.length });
}

// Vercel Cron sends a GET request with the CRON_SECRET bearer token.
// POST is also supported for manual/admin-triggered refreshes.
export const GET = handleRefresh;
export const POST = handleRefresh;
