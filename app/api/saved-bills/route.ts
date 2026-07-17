import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("SavedBill")
    .select("*")
    .eq("userId", session.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ savedBills: data });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (
    typeof body !== "object" ||
    body === null ||
    typeof body.billId !== "string" ||
    typeof body.billTitle !== "string" ||
    (body.action !== "save" && body.action !== "dismiss")
  ) {
    return NextResponse.json(
      { error: "billId, billTitle, and action ('save' | 'dismiss') are required." },
      { status: 400 }
    );
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("SavedBill").upsert(
    {
      userId: session.user.id,
      billId: body.billId,
      billTitle: body.billTitle,
      dismissed: body.action === "dismiss",
      savedAt: new Date().toISOString(),
    },
    { onConflict: "userId,billId" }
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
  const billId = searchParams.get("billId");
  if (!billId) {
    return NextResponse.json({ error: "billId query param is required." }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("SavedBill")
    .delete()
    .eq("userId", session.user.id)
    .eq("billId", billId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
