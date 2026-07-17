import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { buildInsightText } from "@/lib/digestInsight";
import { INTEREST_AREAS } from "@/lib/civicProfileOptions";
import type { WeeklyDigestPayload, WeeklyReadingDigestRecord } from "@/types/digest";

const WEEK_OF_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const BIAS_LEVELS = ["minimal", "low", "moderate", "high"] as const;
const VALID_TOPICS = new Set(INTEREST_AREAS.map((a) => a.value));

function isNonNegativeInt(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function validateDigestPayload(
  body: unknown
): { ok: true; data: WeeklyDigestPayload } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Request body must be an object." };
  }
  const b = body as Record<string, unknown>;

  if (typeof b.weekOf !== "string" || !WEEK_OF_PATTERN.test(b.weekOf)) {
    return { ok: false, error: "weekOf must be an ISO date (YYYY-MM-DD)." };
  }
  if (!isNonNegativeInt(b.articlesAnalyzed)) {
    return { ok: false, error: "articlesAnalyzed must be a non-negative integer." };
  }
  if (!isNonNegativeInt(b.sourceCount)) {
    return { ok: false, error: "sourceCount must be a non-negative integer." };
  }

  const bias = b.biasDistribution;
  if (
    typeof bias !== "object" ||
    bias === null ||
    !BIAS_LEVELS.every((level) => isNonNegativeInt((bias as Record<string, unknown>)[level]))
  ) {
    return { ok: false, error: "biasDistribution must include non-negative integer counts for minimal/low/moderate/high." };
  }

  const topics = b.topTopics;
  if (
    typeof topics !== "object" ||
    topics === null ||
    !Object.entries(topics as Record<string, unknown>).every(
      ([key, value]) => VALID_TOPICS.has(key as (typeof INTEREST_AREAS)[number]["value"]) && isNonNegativeInt(value)
    )
  ) {
    return { ok: false, error: "topTopics must map valid interest areas to non-negative integer counts." };
  }

  return {
    ok: true,
    data: {
      weekOf: b.weekOf,
      articlesAnalyzed: b.articlesAnalyzed,
      sourceCount: b.sourceCount,
      biasDistribution: bias as WeeklyDigestPayload["biasDistribution"],
      topTopics: topics as WeeklyDigestPayload["topTopics"],
    },
  };
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const validated = validateDigestPayload(body);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }
  const payload = validated.data;

  const insightText = buildInsightText(payload);

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("WeeklyReadingDigest").upsert(
    {
      userId: session.user.id,
      weekOf: payload.weekOf,
      articlesAnalyzed: payload.articlesAnalyzed,
      biasDistribution: payload.biasDistribution,
      topTopics: payload.topTopics,
      sourceCount: payload.sourceCount,
      insightText,
      updatedAt: new Date().toISOString(),
    },
    { onConflict: "userId,weekOf" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, insightText });
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit")) || 8, 52);

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("WeeklyReadingDigest")
    .select("*")
    .eq("userId", session.user.id)
    .order("weekOf", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ digests: data as WeeklyReadingDigestRecord[] });
}
