import "server-only";

const CONGRESS_BASE_URL = "https://api.congress.gov/v3";

function apiKey(): string {
  const key = process.env.CONGRESS_API_KEY;
  if (!key) throw new Error("CONGRESS_API_KEY must be set.");
  return key;
}

async function call<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${CONGRESS_BASE_URL}${path}`);
  url.searchParams.set("api_key", apiKey());
  url.searchParams.set("format", "json");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Congress.gov request failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

export interface CongressBillSummary {
  congress: number;
  type: string; // e.g. "hr", "s"
  number: string;
  title: string;
  updateDate: string;
  latestAction?: { actionDate: string; text: string };
  url: string;
}

interface RecentBillsResponse {
  bills: CongressBillSummary[];
}

// Recent bills for a congress, sorted by most recently updated.
// Congress.gov's v3 API has no free-text search — subject-based matching
// happens locally by pulling recent bills, then fetching each one's
// legislative subjects.
export async function listRecentBills(
  congress: number,
  { offset = 0, limit = 50 }: { offset?: number; limit?: number } = {}
): Promise<CongressBillSummary[]> {
  const data = await call<RecentBillsResponse>(`/bill/${congress}`, {
    offset: String(offset),
    limit: String(limit),
    sort: "updateDate+desc",
  });
  return data.bills;
}

export interface CongressBillDetail {
  congress: number;
  type: string;
  number: string;
  title: string;
  summaries?: { url: string };
  latestAction?: { actionDate: string; text: string };
  policyArea?: { name: string };
}

interface BillDetailResponse {
  bill: CongressBillDetail;
}

export async function getBillDetail(
  congress: number,
  billType: string,
  billNumber: string
): Promise<CongressBillDetail> {
  const data = await call<BillDetailResponse>(
    `/bill/${congress}/${billType.toLowerCase()}/${billNumber}`
  );
  return data.bill;
}

interface BillSubjectsResponse {
  subjects: {
    legislativeSubjects: { name: string }[];
    policyArea?: { name: string };
  };
}

export async function getBillSubjects(
  congress: number,
  billType: string,
  billNumber: string
): Promise<string[]> {
  const data = await call<BillSubjectsResponse>(
    `/bill/${congress}/${billType.toLowerCase()}/${billNumber}/subjects`
  );
  const names = data.subjects.legislativeSubjects.map((s) => s.name);
  if (data.subjects.policyArea) names.push(data.subjects.policyArea.name);
  return names;
}

export function congressBillUrl(congress: number, billType: string, billNumber: string): string {
  return `https://www.congress.gov/bill/${congress}th-congress/${billTypeSlug(billType)}/${billNumber}`;
}

function billTypeSlug(billType: string): string {
  const map: Record<string, string> = {
    hr: "house-bill",
    s: "senate-bill",
    hres: "house-resolution",
    sres: "senate-resolution",
    hjres: "house-joint-resolution",
    sjres: "senate-joint-resolution",
  };
  return map[billType.toLowerCase()] ?? billType.toLowerCase();
}
