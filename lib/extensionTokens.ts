import "server-only";
import { randomBytes, createHash } from "crypto";
import { getSupabaseServerClient } from "./supabase/server";

// Prefix makes tokens recognizable in logs/support requests without
// revealing anything about the secret itself.
const TOKEN_PREFIX = "ellu_";

function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

export interface ExtensionTokenSummary {
  id: string;
  label: string;
  createdAt: string;
  lastUsedAt: string | null;
}

/** Creates a new token and returns the raw value once — only its hash is ever stored. */
export async function createExtensionToken(
  userId: string,
  label = "Ellipsis extension"
): Promise<ExtensionTokenSummary & { token: string }> {
  const rawToken = `${TOKEN_PREFIX}${randomBytes(32).toString("base64url")}`;
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("ExtensionToken")
    .insert({ userId, tokenHash: hashToken(rawToken), label })
    .select("id, label, createdAt, lastUsedAt")
    .single();

  if (error || !data) throw new Error(error?.message || "Failed to create extension token.");
  return { ...data, token: rawToken };
}

export async function listExtensionTokens(userId: string): Promise<ExtensionTokenSummary[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("ExtensionToken")
    .select("id, label, createdAt, lastUsedAt")
    .eq("userId", userId)
    .order("createdAt", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function revokeExtensionToken(userId: string, tokenId: string): Promise<void> {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("ExtensionToken")
    .delete()
    .eq("userId", userId)
    .eq("id", tokenId);

  if (error) throw new Error(error.message);
}

/** Resolves a raw bearer token to the userId that owns it, and records the use. Returns null for an invalid or revoked token. */
export async function resolveUserIdFromToken(rawToken: string): Promise<string | null> {
  if (!rawToken.startsWith(TOKEN_PREFIX)) return null;

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("ExtensionToken")
    .select("id, userId")
    .eq("tokenHash", hashToken(rawToken))
    .maybeSingle();

  if (error || !data) return null;

  await supabase
    .from("ExtensionToken")
    .update({ lastUsedAt: new Date().toISOString() })
    .eq("id", data.id);

  return data.userId;
}
