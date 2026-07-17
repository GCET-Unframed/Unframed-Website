import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getCachedBills, getLastRefreshedAt } from "@/lib/bills";
import { scoreAndFilterBills } from "@/lib/relevance";
import { INTEREST_AREAS, type CivicProfileInput, type InterestArea } from "@/lib/civicProfileOptions";
import type { BillsFeedResponse } from "@/types/bills";

const VALID_INTEREST_AREAS = new Set(INTEREST_AREAS.map((a) => a.value));
const VALID_SCOPES = new Set(["state", "federal", "all"]);

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const scopeParam = searchParams.get("scope") ?? "state";
  const scope = VALID_SCOPES.has(scopeParam) ? (scopeParam as "state" | "federal" | "all") : "state";

  const topicsParam = searchParams.get("topics");
  const topicOverride = topicsParam
    ? (topicsParam.split(",").filter((t): t is InterestArea => VALID_INTEREST_AREAS.has(t as InterestArea)) as InterestArea[])
    : undefined;

  const supabase = getSupabaseServerClient();

  const { data: profileRow, error: profileError } = await supabase
    .from("CivicProfile")
    .select("*")
    .eq("userId", session.user.id)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }
  if (!profileRow) {
    return NextResponse.json({ error: "Civic profile not found." }, { status: 404 });
  }
  const profile = profileRow as CivicProfileInput;

  const { data: savedRows, error: savedError } = await supabase
    .from("SavedBill")
    .select("billId, dismissed")
    .eq("userId", session.user.id);

  if (savedError) {
    return NextResponse.json({ error: savedError.message }, { status: 500 });
  }

  const dismissedIds = new Set(
    (savedRows as { billId: string; dismissed: boolean }[])
      .filter((r) => r.dismissed)
      .map((r) => r.billId)
  );
  const savedBillIds = (savedRows as { billId: string; dismissed: boolean }[])
    .filter((r) => !r.dismissed)
    .map((r) => r.billId);

  const cachedBills = await getCachedBills(scope, profile.state);
  const scored = scoreAndFilterBills(cachedBills, profile, topicOverride).filter(
    (bill) => !dismissedIds.has(bill.id)
  );
  const lastRefreshedAt = await getLastRefreshedAt();

  const response: BillsFeedResponse = { bills: scored, savedBillIds, lastRefreshedAt };
  return NextResponse.json(response);
}
