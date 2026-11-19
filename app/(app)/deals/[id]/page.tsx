"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useFetch } from "@/hooks/useFetch";
import { formatDate, formatMoney } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { ErrorState, LoadingState } from "@/components/ui/States";
import type { Deal } from "@/types";

export default function DealDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, error, loading, reload } = useFetch<{ data: Deal }>(`/deals/${id}`);

  if (loading) return <LoadingState />;
  if (error || !data) return <ErrorState message={error ?? "Deal not found."} onRetry={reload} />;

  const deal = data.data;
  const card = "rounded-lg border border-gray-800 bg-gray-900 p-4";

  return (
    <div className="space-y-6">
      <Link href="/deals" className="text-sm text-gray-400 hover:text-blue-400">
        ← Back to deals
      </Link>

      <div className={card}>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-100">{deal.title}</h1>
          <Badge value={deal.stage} />
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-gray-500">Value</dt>
            <dd className="text-gray-200">{formatMoney(deal.value)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Expected close date</dt>
            <dd className="text-gray-200">{formatDate(deal.expected_close_date)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Customer</dt>
            <dd>
              {deal.customer ? (
                <Link href={`/customers/${deal.customer_id}`} className="text-blue-400 hover:underline">
                  {deal.customer.name} ({deal.customer.company})
                </Link>
              ) : (
                "—"
              )}
            </dd>
          </div>
        </dl>

        <div className="mt-4 text-sm">
          <div className="text-gray-500">Description</div>
          <p className="text-gray-200">{deal.description ?? "No description."}</p>
        </div>

        {deal.stage === "lost" && (
          <div className="mt-4 rounded bg-red-950 p-3 text-sm text-red-300">
            <span className="font-medium">Lost reason: </span>
            {deal.lost_reason ?? "No reason recorded."}
          </div>
        )}
      </div>
    </div>
  );
}