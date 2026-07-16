import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { validateCivicProfileInput } from "@/lib/civicProfileOptions";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const validated = validateCivicProfileInput(body);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("CivicProfile").upsert(
    {
      userId: session.user.id,
      ...validated.data,
      updatedAt: new Date().toISOString(),
    },
    { onConflict: "userId" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
