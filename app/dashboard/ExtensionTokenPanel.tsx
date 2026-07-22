"use client";

import { useEffect, useState } from "react";

interface TokenSummary {
  id: string;
  label: string;
  createdAt: string;
  lastUsedAt: string | null;
}

function formatDate(iso: string | null): string {
  if (!iso) return "Never";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ExtensionTokenPanel() {
  const [tokens, setTokens] = useState<TokenSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [freshToken, setFreshToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);

  async function loadTokens() {
    const res = await fetch("/api/extension-tokens");
    if (!res.ok) return;
    const data: { tokens: TokenSummary[] } = await res.json();
    setTokens(data.tokens);
  }

  useEffect(() => {
    loadTokens().finally(() => setLoading(false));
  }, []);

  async function createToken() {
    setCreating(true);
    setCopied(false);
    try {
      const res = await fetch("/api/extension-tokens", { method: "POST" });
      if (!res.ok) return;
      const data: { token: TokenSummary & { token: string } } = await res.json();
      setFreshToken(data.token.token);
      await loadTokens();
    } finally {
      setCreating(false);
    }
  }

  async function revokeToken(id: string) {
    const res = await fetch(`/api/extension-tokens?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (res.ok) await loadTokens();
  }

  async function copyToken() {
    if (!freshToken) return;
    await navigator.clipboard.writeText(freshToken);
    setCopied(true);
  }

  if (loading) {
    return <p className="text-stone">Loading tokens…</p>;
  }

  return (
    <div className="rounded-3xl border border-stone/15 bg-white/70 p-6">
      <p className="text-sm font-bold uppercase tracking-widest text-stone">Ellipsis connection</p>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-stone">
        Generate a token and paste it into the Ellipsis extension&apos;s settings to enable direct
        syncing — your weekly reading digest and any saved article analyses you opt into. Anyone
        with this token can sync data to your account, so treat it like a password.
      </p>

      {freshToken && (
        <div className="mt-5 rounded-2xl border border-royal/30 bg-sky-soft p-4">
          <p className="text-sm font-semibold text-charcoal">
            Copy this token now — you won&apos;t be able to see it again.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <code className="break-all rounded-lg bg-white/80 px-3 py-2 text-sm text-charcoal">{freshToken}</code>
            <button
              type="button"
              onClick={copyToken}
              className="rounded-full bg-royal px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-royal-deep"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={createToken}
        disabled={creating}
        className="mt-5 rounded-full bg-royal px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-royal-deep disabled:cursor-not-allowed disabled:opacity-60"
      >
        {creating ? "Generating…" : "Generate new token"}
      </button>

      {tokens.length > 0 && (
        <div className="mt-6 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wide text-stone">Active tokens</p>
          {tokens.map((token) => (
            <div
              key={token.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone/10 px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-charcoal">{token.label}</p>
                <p className="text-xs text-stone">
                  Created {formatDate(token.createdAt)} · Last used {formatDate(token.lastUsedAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => revokeToken(token.id)}
                className="rounded-full px-4 py-1.5 text-sm font-semibold text-stone hover:text-orange"
              >
                Revoke
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
