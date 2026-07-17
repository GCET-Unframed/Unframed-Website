import type { InterestArea } from "@/lib/civicProfileOptions";

export type BillScope = "state" | "federal";
export type BillSource = "legiscan" | "congress";

export type BillStatus =
  | "introduced"
  | "in_committee"
  | "passed_chamber"
  | "signed_into_law"
  | "vetoed"
  | "failed"
  | "unknown";

export interface Bill {
  id: string; // "<source>:<sourceId>"
  source: BillSource;
  scope: BillScope;
  state: string | null; // null for federal bills
  billNumber: string;
  title: string;
  summary: string;
  status: BillStatus;
  subjects: InterestArea[];
  url: string;
  lastActionDate: string | null; // ISO date
  sessionYear: number | null;
}

export interface ScoredBill extends Bill {
  relevanceScore: number;
  relevanceReason: string;
}

export interface SavedBillRecord {
  userId: string;
  billId: string;
  billTitle: string;
  savedAt: string;
  dismissed: boolean;
}

export interface BillsFeedResponse {
  bills: ScoredBill[];
  savedBillIds: string[];
  lastRefreshedAt: string | null;
}
