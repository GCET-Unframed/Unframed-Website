import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { resolveUserId } from "@/lib/apiAuth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { SavedArticlePayload } from "@/types/savedArticles";

function isBiasMetric(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;
  const metric = value as Record<string, unknown>;
  return (
    (metric.score === null || typeof metric.score === "number") &&
    typeof metric.confidence === "number" &&
    typeof metric.evidenceCount === "number" &&
    (metric.status === "assessed" || metric.status === "insufficient-evidence")
  );
}

function validateSavedArticlePayload(
  body: unknown
): { ok: true; data: SavedArticlePayload } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Request body must be an object." };
  }
  const b = body as Record<string, unknown>;

  if (typeof b.articleUrl !== "string" || !b.articleUrl.trim()) {
    return { ok: false, error: "articleUrl is required." };
  }
  if (typeof b.articleTitle !== "string" || !b.articleTitle.trim()) {
    return { ok: false, error: "articleTitle is required." };
  }
  if (typeof b.savedAt !== "string" || Number.isNaN(Date.parse(b.savedAt))) {
    return { ok: false, error: "savedAt must be an ISO date string." };
  }
  if (typeof b.summary !== "string") {
    return { ok: false, error: "summary must be a string." };
  }

  const scores = b.biasScores as Record<string, unknown> | undefined;
  const requiredDimensions = ["political_bias", "gender_bias", "ethnicity_bias", "class_bias"];
  if (
    typeof scores !== "object" ||
    scores === null ||
    !requiredDimensions.every((dimension) => isBiasMetric(scores[dimension]))
  ) {
    return { ok: false, error: "biasScores must include political_bias, gender_bias, ethnicity_bias, and class_bias metrics." };
  }

  if (!Array.isArray(b.perspectives)) {
    return { ok: false, error: "perspectives must be an array." };
  }
  if (!Array.isArray(b.framingNotes)) {
    return { ok: false, error: "framingNotes must be an array." };
  }

  return {
    ok: true,
    data: {
      articleUrl: b.articleUrl,
      articleTitle: b.articleTitle,
      savedAt: b.savedAt,
      summary: b.summary,
      biasScores: b.biasScores as SavedArticlePayload["biasScores"],
      perspectives: b.perspectives as SavedArticlePayload["perspectives"],
      framingNotes: b.framingNotes as SavedArticlePayload["framingNotes"]
    }
  };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("SavedArticle")
    .select("*")
    .eq("userId", session.user.id)
    .order("savedAt", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ savedArticles: data });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = await resolveUserId(request, session?.user?.id);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const validated = validateSavedArticlePayload(body);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }
  const payload = validated.data;

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("SavedArticle").upsert(
    {
      userId,
      articleUrl: payload.articleUrl,
      articleTitle: payload.articleTitle,
      savedAt: payload.savedAt,
      biasScores: payload.biasScores,
      perspectives: payload.perspectives,
      framingNotes: payload.framingNotes,
      summary: payload.summary,
      syncedAt: new Date().toISOString()
    },
    { onConflict: "userId,articleUrl" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const articleUrl = searchParams.get("articleUrl");
  if (!articleUrl) {
    return NextResponse.json({ error: "articleUrl query param is required." }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("SavedArticle")
    .delete()
    .eq("userId", session.user.id)
    .eq("articleUrl", articleUrl);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
