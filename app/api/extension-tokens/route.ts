import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { createExtensionToken, listExtensionTokens, revokeExtensionToken } from "@/lib/extensionTokens";

// Token creation and management always requires a real dashboard session —
// bearer tokens can't be used to mint or list other tokens.

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tokens = await listExtensionTokens(session.user.id);
  return NextResponse.json({ tokens });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const label = typeof body?.label === "string" && body.label.trim() ? body.label.trim() : undefined;

  const created = await createExtensionToken(session.user.id, label);
  return NextResponse.json({ token: created });
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const tokenId = searchParams.get("id");
  if (!tokenId) {
    return NextResponse.json({ error: "id query param is required." }, { status: 400 });
  }

  await revokeExtensionToken(session.user.id, tokenId);
  return NextResponse.json({ ok: true });
}
