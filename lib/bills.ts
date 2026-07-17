import "server-only";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { matchTopics } from "@/lib/billTopics";
import { legiscanStatusLabel, type LegiScanBill } from "@/lib/legiscan";
import { congressBillUrl, type CongressBillDetail } from "@/lib/congress";
import type { Bill, BillScope, BillStatus } from "@/types/bills";

const CONGRESS_STATUS_KEYWORDS: [RegExp, BillStatus][] = [
  [/signed by president|became public law/i, "signed_into_law"],
  [/vetoed/i, "vetoed"],
  [/failed|rejected/i, "failed"],
  [/passed (house|senate)/i, "passed_chamber"],
  [/committee/i, "in_committee"],
];

function congressStatusLabel(latestActionText: string | undefined): BillStatus {
  if (!latestActionText) return "unknown";
  for (const [pattern, status] of CONGRESS_STATUS_KEYWORDS) {
    if (pattern.test(latestActionText)) return status;
  }
  return "introduced";
}

export function normalizeLegiscanBill(bill: LegiScanBill): Bill {
  const subjectText = (bill.subjects ?? []).map((s) => s.subject_name);
  return {
    id: `legiscan:${bill.bill_id}`,
    source: "legiscan",
    scope: "state",
    state: bill.state,
    billNumber: bill.bill_number,
    title: bill.title,
    summary: bill.description,
    status: legiscanStatusLabel(bill.status) as BillStatus,
    subjects: matchTopics([bill.title, bill.description, ...subjectText]),
    url: bill.url,
    lastActionDate: bill.status_date || null,
    sessionYear: bill.session?.year_start ?? null,
  };
}

export function normalizeCongressBill(
  detail: CongressBillDetail,
  subjectNames: string[]
): Bill {
  const url = congressBillUrl(detail.congress, detail.type, detail.number);
  return {
    id: `congress:${detail.congress}-${detail.type}${detail.number}`,
    source: "congress",
    scope: "federal",
    state: null,
    billNumber: `${detail.type.toUpperCase()} ${detail.number}`,
    title: detail.title,
    summary: detail.latestAction?.text ?? detail.title,
    status: congressStatusLabel(detail.latestAction?.text),
    subjects: matchTopics([detail.title, ...subjectNames]),
    url,
    lastActionDate: detail.latestAction?.actionDate ?? null,
    sessionYear: null,
  };
}

interface BillRow {
  id: string;
  source: string;
  scope: string;
  state: string | null;
  billNumber: string;
  title: string;
  summary: string;
  status: string;
  subjects: string[];
  url: string;
  lastActionDate: string | null;
  sessionYear: number | null;
}

function toRow(bill: Bill): BillRow & { updatedAt: string } {
  return {
    id: bill.id,
    source: bill.source,
    scope: bill.scope,
    state: bill.state,
    billNumber: bill.billNumber,
    title: bill.title,
    summary: bill.summary,
    status: bill.status,
    subjects: bill.subjects,
    url: bill.url,
    lastActionDate: bill.lastActionDate,
    sessionYear: bill.sessionYear,
    updatedAt: new Date().toISOString(),
  };
}

function fromRow(row: BillRow): Bill {
  return {
    id: row.id,
    source: row.source as Bill["source"],
    scope: row.scope as BillScope,
    state: row.state,
    billNumber: row.billNumber,
    title: row.title,
    summary: row.summary,
    status: row.status as BillStatus,
    subjects: row.subjects as Bill["subjects"],
    url: row.url,
    lastActionDate: row.lastActionDate,
    sessionYear: row.sessionYear,
  };
}

export async function upsertBills(bills: Bill[]): Promise<void> {
  if (bills.length === 0) return;
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("Bill")
    .upsert(bills.map(toRow), { onConflict: "id" });
  if (error) throw new Error(`Failed to upsert bills: ${error.message}`);
}

export async function getCachedBills(scope: "state" | "federal" | "all", state: string): Promise<Bill[]> {
  const supabase = getSupabaseServerClient();
  let query = supabase.from("Bill").select("*");

  if (scope === "state") {
    query = query.eq("scope", "state").eq("state", state);
  } else if (scope === "federal") {
    query = query.eq("scope", "federal");
  } else {
    query = query.or(`scope.eq.federal,and(scope.eq.state,state.eq.${state})`);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Failed to load cached bills: ${error.message}`);
  return (data as BillRow[]).map(fromRow);
}

export async function getLastRefreshedAt(): Promise<string | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("Bill")
    .select("updatedAt")
    .order("updatedAt", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(`Failed to load refresh timestamp: ${error.message}`);
  return data?.updatedAt ?? null;
}

export async function getDistinctProfileStates(): Promise<string[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from("CivicProfile").select("state");
  if (error) throw new Error(`Failed to load profile states: ${error.message}`);
  return Array.from(new Set((data as { state: string }[]).map((r) => r.state)));
}
