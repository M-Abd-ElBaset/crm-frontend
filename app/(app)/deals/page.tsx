"use client";

import { useState } from "react";
import Link from "next/link";
import { useFetch } from "@/hooks/useFetch";
import { DEAL_STAGES } from "@/lib/constants";
import { formatDate, formatMoney } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";
import { Pagination } from "@/components/ui/Pagination";
import type { Deal, Paginated } from "@/types";

export default function DealsPage() {
  const [page, setPage] = useState(1);
  const [stage, setStage] = useState("");

  const { data, error, loading, reload } = useFetch<Paginated<Deal>>(
    `/deals?page=${page}${stage ? `&stage=${stage}` : ""}`,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-100">Deals</h1>
        <select
          value={stage}
          onChange={(e) => {
            setStage(e.target.value);
            setPage(1);
          }}
          className="rounded border border-gray-700 bg-gray-800 p-2 text-sm text-gray-100 focus:border-blue-500 focus:outline-none"
        >
          <option value="">All stages</option>
          {DEAL_STAGES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-800 bg-gray-900">
        {loading && <LoadingState />}
        {error && <ErrorState message={error} onRetry={reload} />}
        {!loading && !error && data?.data.length === 0 && (
          <EmptyState message="No deals found for this filter." />
        )}

        {!loading && !error && data && data.data.length > 0 && (
          <>
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-800 text-gray-400">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Stage</th>
                  <th className="p-3">Close date</th>
                  <th className="p-3 text-right">Value</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((d) => (
                  <tr key={d.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50">
                    <td className="p-3">
                      <Link href={`/deals/${d.id}`} className="text-blue-400 hover:underline">
                        {d.title}
                      </Link>
                    </td>
                    <td className="p-3 text-gray-300">
                      {d.customer ? (
                        <Link href={`/customers/${d.customer_id}`} className="hover:text-blue-400">
                          {d.customer.name}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-3"><Badge value={d.stage} /></td>
                    <td className="p-3 text-gray-300">{formatDate(d.expected_close_date)}</td>
                    <td className="p-3 text-right text-gray-300">{formatMoney(d.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination page={page} lastPage={data.meta.last_page} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}