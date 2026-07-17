import "server-only";

const LEGISCAN_BASE_URL = "https://api.legiscan.com/";

function apiKey(): string {
  const key = process.env.LEGISCAN_API_KEY;
  if (!key) throw new Error("LEGISCAN_API_KEY must be set.");
  return key;
}

async function call<T>(params: Record<string, string>): Promise<T> {
  const url = new URL(LEGISCAN_BASE_URL);
  url.searchParams.set("key", apiKey());
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`LegiScan request failed: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  if (data.status === "ERROR") {
    throw new Error(`LegiScan error: ${data.alert?.message ?? "unknown error"}`);
  }
  return data as T;
}

export interface LegiScanSearchResult {
  relevance: number;
  state: string;
  bill_number: string;
  bill_id: number;
  title: string;
  last_action_date: string;
  last_action: string;
  url: string;
}

interface LegiScanSearchResponse {
  status: string;
  searchresult: Record<string, LegiScanSearchResult | { summary: unknown }>;
}

// getSearch: filter by state + keyword. Two-letter state code, or "ALL".
export async function getSearch(
  state: string,
  query: string
): Promise<LegiScanSearchResult[]> {
  const data = await call<LegiScanSearchResponse>({
    op: "getSearch",
    state,
    query,
  });
  return Object.entries(data.searchresult)
    .filter(([key]) => key !== "summary")
    .map(([, value]) => value as LegiScanSearchResult);
}

export interface LegiScanBill {
  bill_id: number;
  bill_number: string;
  state: string;
  title: string;
  description: string;
  status: number;
  status_date: string;
  session: { session_id: number; year_start: number; year_end: number };
  subjects?: { subject_name: string }[];
  url: string;
}

interface LegiScanBillResponse {
  status: string;
  bill: LegiScanBill;
}

// getBill: full bill data (summary, status, subjects) for a single bill.
export async function getBill(billId: number): Promise<LegiScanBill> {
  const data = await call<LegiScanBillResponse>({
    op: "getBill",
    id: String(billId),
  });
  return data.bill;
}

// LegiScan's numeric status codes (per API docs).
const STATUS_MAP: Record<number, string> = {
  1: "introduced",
  2: "in_committee",
  3: "passed_chamber",
  4: "signed_into_law",
  5: "vetoed",
  6: "failed",
};

export function legiscanStatusLabel(status: number): string {
  return STATUS_MAP[status] ?? "unknown";
}
