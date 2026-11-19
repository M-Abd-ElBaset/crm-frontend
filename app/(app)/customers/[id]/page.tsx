"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { useFetch } from "@/hooks/useFetch";
import { formatDate, formatMoney } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { Markdown } from "@/components/ui/Markdown";
import { ErrorState, LoadingState } from "@/components/ui/States";
import type { Customer } from "@/types";

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, error, loading, reload } = useFetch<{ data: Customer }>(`/customers/${id}`);

  const [summary, setSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  async function generateSummary() {
    setSummaryLoading(true);
    setSummaryError(null);

    try {
      const res = await api<{ data: { summary: string } }>(`/customers/${id}/summary`, {
        method: "POST",
      });
      setSummary(res.data.summary);
    } catch (err) {
      setSummaryError(err instanceof ApiError ? err.message : "Could not generate the summary.");
    } finally {
      setSummaryLoading(false);
    }
  }

  if (loading) return <LoadingState />;
  if (error || !data) return <ErrorState message={error ?? "Customer not found."} onRetry={reload} />;

  const customer = data.data;
  const card = "rounded-lg border border-gray-800 bg-gray-900 p-4";

  return (
    <div className="space-y-6">
      <Link href="/customers" className="text-sm text-gray-400 hover:text-blue-400">
        ← Back to customers
      </Link>

      <div className={card}>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-100">{customer.name}</h1>
          <Badge value={customer.status} />
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div><dt className="text-gray-500">Company</dt><dd className="text-gray-200">{customer.company}</dd></div>
          <div><dt className="text-gray-500">Industry</dt><dd className="text-gray-200">{customer.industry ?? "—"}</dd></div>
          <div><dt className="text-gray-500">Email</dt><dd className="text-gray-200">{customer.email}</dd></div>
          <div><dt className="text-gray-500">Phone</dt><dd className="text-gray-200">{customer.phone ?? "—"}</dd></div>
        </dl>
        <div className="mt-4 text-sm">
          <div className="text-gray-500">Notes</div>
          <p className="text-gray-200">{customer.notes ?? "No notes."}</p>
        </div>
      </div>

      <div className={card}>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-100">AI Summary</h2>
          <button
            onClick={generateSummary}
            disabled={summaryLoading}
            className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {summary ? "Regenerate" : "Generate AI summary"}
          </button>
        </div>

        {summaryLoading && <LoadingState label="Generating summary, this can take a few seconds..." />}
        {summaryError && <div className="mt-3"><ErrorState message={summaryError} onRetry={generateSummary} /></div>}
        {summary && !summaryLoading && (
          <>
            <Markdown>{summary}</Markdown>
            <p className="mt-3 text-xs text-gray-500">
              AI-generated from the customer&apos;s CRM data. Check important details before acting.
            </p>
          </>
        )}
      </div>

      <div className={card}>
        <h2 className="mb-3 font-semibold text-gray-100">Deals ({customer.deals?.length ?? 0})</h2>
        {customer.deals && customer.deals.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-800 text-gray-400">
              <tr>
                <th className="p-2">Title</th>
                <th className="p-2">Stage</th>
                <th className="p-2">Close date</th>
                <th className="p-2 text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {customer.deals.map((d) => (
                <tr key={d.id} className="border-b border-gray-800 last:border-0">
                  <td className="p-2">
                    <Link href={`/deals/${d.id}`} className="text-blue-400 hover:underline">{d.title}</Link>
                  </td>
                  <td className="p-2"><Badge value={d.stage} /></td>
                  <td className="p-2 text-gray-300">{formatDate(d.expected_close_date)}</td>
                  <td className="p-2 text-right text-gray-300">{formatMoney(d.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-gray-400">This customer has no deals yet.</p>
        )}
      </div>
    </div>
  );
}