"use client";

import { useState } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import { useFetch } from "@/hooks/useFetch";
import { DEAL_STAGES } from "@/lib/constants";
import { formatMoney } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { Markdown } from "@/components/ui/Markdown";
import { ErrorState, LoadingState } from "@/components/ui/States";
import type { SalesStats } from "@/types";

const card = "rounded-lg border border-gray-800 bg-gray-900 p-4";

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className={card}>
      <div className="text-sm text-gray-400">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-gray-100">{value}</div>
      {sub && <div className="mt-1 text-xs text-gray-500">{sub}</div>}
    </div>
  );
}

export default function ReportPage() {
  const { data, error, loading, reload } = useFetch<{ data: SalesStats }>("/reports/sales");

  const [summary, setSummary] = useState<string | null>(null);
  const [summaryStats, setSummaryStats] = useState<SalesStats | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  async function generateSummary() {
    setSummaryLoading(true);
    setSummaryError(null);

    try {
      const res = await api<{ data: { stats: SalesStats; summary: string } }>(
        "/reports/sales/summary",
        { method: "POST" },
      );
      setSummary(res.data.summary);
      setSummaryStats(res.data.stats); // show the exact numbers the AI was given
    } catch (err) {
      setSummaryError(err instanceof ApiError ? err.message : "Could not generate the summary.");
    } finally {
      setSummaryLoading(false);
    }
  }

  if (loading) return <LoadingState />;
  if (error || !data) return <ErrorState message={error ?? "Report not available."} onRetry={reload} />;

  const stats = summaryStats ?? data.data;
  const maxCount = Math.max(1, ...DEAL_STAGES.map((s) => stats.by_stage[s].count));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-100">Sales Report</h1>
        <span className="text-sm text-gray-500">As of {stats.as_of}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatCard label="Total deals" value={String(stats.total_deals)} />
        <StatCard
          label="Pipeline value"
          value={formatMoney(stats.pipeline.total)}
          sub={`${stats.pipeline.count} open deals`}
        />
        <StatCard
          label="Won"
          value={formatMoney(stats.won.total)}
          sub={`${stats.won.count} deals`}
        />
        <StatCard
          label="Lost"
          value={formatMoney(stats.lost.total)}
          sub={`${stats.lost.count} deals`}
        />
        <StatCard
          label="Win rate"
          value={stats.win_rate_percent === null ? "—" : `${stats.win_rate_percent}%`}
          sub="Won / closed deals"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className={card}>
          <h2 className="mb-3 font-semibold text-gray-100">Deals by stage</h2>
          <div className="space-y-3">
            {DEAL_STAGES.map((stage) => {
              const row = stats.by_stage[stage];
              return (
                <div key={stage}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <Badge value={stage} />
                    <span className="text-gray-400">
                      {row.count} · {formatMoney(row.total)}
                    </span>
                  </div>
                  <div className="h-2 rounded bg-gray-800">
                    <div
                      className="h-2 rounded bg-blue-600"
                      style={{ width: `${(row.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className={card}>
            <h2 className="mb-2 font-semibold text-gray-100">Attention</h2>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>
                Closing in the next 30 days: <b>{stats.closing_next_30_days.count}</b> deals ·{" "}
                {formatMoney(stats.closing_next_30_days.total)}
              </li>
              <li>
                Overdue open deals: <b>{stats.overdue_open_deals.count}</b> deals ·{" "}
                {formatMoney(stats.overdue_open_deals.total)}
              </li>
            </ul>
          </div>

          <div className={card}>
            <h2 className="mb-2 font-semibold text-gray-100">Lost reasons</h2>
            {stats.lost_reasons.length === 0 ? (
              <p className="text-sm text-gray-400">No lost deals with a recorded reason.</p>
            ) : (
              <ul className="space-y-1 text-sm text-gray-300">
                {stats.lost_reasons.map((r) => (
                  <li key={r.reason}>
                    {r.reason}: <b>{r.count}</b>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className={card}>
        <h2 className="mb-3 font-semibold text-gray-100">Top customers by deal value</h2>
        {stats.top_customers.length === 0 ? (
          <p className="text-sm text-gray-400">No customers with deals yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-800 text-gray-400">
              <tr>
                <th className="p-2">Customer</th>
                <th className="p-2">Company</th>
                <th className="p-2 text-right">Deals</th>
                <th className="p-2 text-right">Total value</th>
              </tr>
            </thead>
            <tbody>
              {stats.top_customers.map((c) => (
                <tr key={c.id} className="border-b border-gray-800 last:border-0">
                  <td className="p-2">
                    <Link href={`/customers/${c.id}`} className="text-blue-400 hover:underline">
                      {c.name}
                    </Link>
                  </td>
                  <td className="p-2 text-gray-300">{c.company}</td>
                  <td className="p-2 text-right text-gray-300">{c.deals_count}</td>
                  <td className="p-2 text-right text-gray-300">{formatMoney(c.total_value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className={card}>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-100">AI Performance Summary</h2>
          <button
            onClick={generateSummary}
            disabled={summaryLoading}
            className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {summary ? "Regenerate" : "Generate AI summary"}
          </button>
        </div>

        {summaryLoading && <LoadingState label="Analyzing the report, this can take a few seconds..." />}
        {summaryError && (
          <div className="mt-3">
            <ErrorState message={summaryError} onRetry={generateSummary} />
          </div>
        )}
        {summary && !summaryLoading && (
          <>
            <Markdown>{summary}</Markdown>
            <p className="mt-3 text-xs text-gray-500">
              The AI only writes the text. All figures above are calculated by the database.
            </p>
          </>
        )}
      </div>
    </div>
  );
}