import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { sendMessage } from "@/lib/anthropic";
import type { BillChatContext, ChatMessage } from "@/types/chat";

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;

function isChatMessage(value: unknown): value is ChatMessage {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    (v.role === "user" || v.role === "assistant") &&
    typeof v.content === "string" &&
    v.content.trim().length > 0 &&
    v.content.length <= MAX_MESSAGE_LENGTH
  );
}

function isBillContext(value: unknown): value is BillChatContext {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.title === "string" &&
    typeof v.summary === "string" &&
    typeof v.status === "string" &&
    typeof v.relevanceReason === "string"
  );
}

function buildSystemPrompt(bill: BillChatContext): string {
  return `You are a civic assistant embedded in a legislation card on Unframed, a civic dashboard. A user is asking questions about one specific bill. Answer only using the bill information below plus general civic/legislative knowledge — never invent specific provisions, dates, or numbers that aren't given. If the user asks something the context below doesn't cover, say so plainly and suggest they check the full bill text. Keep answers concise (a few sentences), neutral, and don't tell the user how to feel about the bill.

Bill: ${bill.title}
Status: ${bill.status}
Summary: ${bill.summary}
Why it's relevant to this user: ${bill.relevanceReason}`;
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
    !isBillContext((body as Record<string, unknown>).bill) ||
    !Array.isArray((body as Record<string, unknown>).messages) ||
    !(body as { messages: unknown[] }).messages.every(isChatMessage) ||
    (body as { messages: unknown[] }).messages.length === 0 ||
    (body as { messages: unknown[] }).messages.length > MAX_MESSAGES
  ) {
    return NextResponse.json(
      { error: "bill and a non-empty messages array (max 20 turns) are required." },
      { status: 400 }
    );
  }

  const { bill, messages } = body as { bill: BillChatContext; messages: ChatMessage[] };

  try {
    const reply = await sendMessage(buildSystemPrompt(bill), messages);
    return NextResponse.json({ message: { role: "assistant", content: reply } });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Chat request failed." },
      { status: 502 }
    );
  }
}
