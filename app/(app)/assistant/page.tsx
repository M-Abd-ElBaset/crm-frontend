"use client";

import { useEffect, useRef, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { Markdown } from "@/components/ui/Markdown";

interface Message {
  role: "user" | "assistant" | "error";
  text: string;
  tools?: string[];
}

const SUGGESTIONS = [
  "What are the highest-value open deals?",
  "Which deals are expected to close this month?",
  "What is the total value of deals in the Negotiation stage?",
  "Which customers have the most active deals?",
  "What are the reasons behind the lost deals?",
];

const TOOL_LABELS: Record<string, string> = {
  top_open_deals: "Top open deals",
  deals_closing_in_month: "Deals closing by month",
  total_value_by_stage: "Total value by stage",
  customers_by_active_deals: "Customers by active deals",
  lost_deal_reasons: "Lost deal reasons",
};

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(question: string) {
    const q = question.trim();
    if (q.length < 3 || loading) return;

    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setLoading(true);

    try {
      const res = await api<{ data: { answer: string; tools_used: { tool: string }[] } }>(
        "/assistant/deals/ask",
        { method: "POST", body: JSON.stringify({ question: q }) },
      );
      const tools = [...new Set(res.data.tools_used.map((t) => t.tool))];
      setMessages((m) => [...m, { role: "assistant", text: res.data.answer, tools }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "error", text: err instanceof ApiError ? err.message : "Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[75vh] flex-col space-y-3">
      <h1 className="text-xl font-semibold text-gray-100">Deal Assistant</h1>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-lg border border-gray-800 bg-gray-900 p-4">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-400">
              Ask about your deals. Answers come from your CRM data. Try one of these:
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-gray-700 px-3 py-1 text-sm text-gray-300 hover:border-blue-500 hover:text-blue-400"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                m.role === "user"
                  ? "max-w-[80%] rounded-lg bg-blue-600 px-3 py-2 text-sm text-white"
                  : m.role === "error"
                    ? "max-w-[80%] rounded-lg bg-red-950 px-3 py-2 text-sm text-red-300"
                    : "max-w-[80%] rounded-lg bg-gray-800 px-3 py-2 text-sm"
              }
            >
              {m.role === "assistant" ? <Markdown>{m.text}</Markdown> : m.text}
              {m.role === "assistant" && m.tools && m.tools.length > 0 && (
                <div className="mt-2 border-t border-gray-700 pt-1 text-xs text-gray-500">
                  Source: {m.tools.map((t) => TOOL_LABELS[t] ?? t).join(", ")}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-blue-500" />
            Looking up your data...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={500}
          placeholder="Ask a question about your deals..."
          className="flex-1 rounded border border-gray-700 bg-gray-800 p-2 text-sm text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || input.trim().length < 3}
          className="rounded bg-blue-600 px-4 text-sm text-white hover:bg-blue-500 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}