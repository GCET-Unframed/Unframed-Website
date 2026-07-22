"use client";

import { useId, useState } from "react";
import type { BillChatContext, ChatMessage } from "@/types/chat";

export default function BillChat({ bill }: { bill: BillChatContext }) {
  const inputId = useId();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAsk() {
    const question = input.trim();
    if (!question || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: question }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/bill-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bill, messages: nextMessages }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Couldn't get a response. Try again.");
      }
      const data: { message: ChatMessage } = await res.json();
      setMessages((prev) => [...prev, data.message]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't get a response. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl bg-sky-soft/60 p-4">
      {messages.length > 0 && (
        <div className="mb-3 max-h-64 space-y-3 overflow-y-auto pr-1">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <p
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "bg-royal text-white"
                    : "bg-white text-charcoal"
                }`}
              >
                {message.content}
              </p>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <p className="max-w-[85%] rounded-2xl bg-white px-3.5 py-2 text-sm text-stone">
                Thinking…
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <p role="alert" className="mb-3 text-sm font-semibold text-orange">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <label htmlFor={inputId} className="sr-only">
          Ask a question about this bill
        </label>
        <input
          id={inputId}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleAsk();
            }
          }}
          placeholder="e.g. how does this affect me?"
          disabled={loading}
          className="flex-1 rounded-lg border border-stone/20 bg-white px-3 py-2 text-sm text-charcoal placeholder:text-stone/70 focus:border-royal focus:outline-none focus:ring-2 focus:ring-royal/40"
        />
        <button
          type="button"
          onClick={handleAsk}
          disabled={loading || !input.trim()}
          className="rounded-lg bg-charcoal px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-charcoal/80 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Ask
        </button>
      </div>
    </div>
  );
}
