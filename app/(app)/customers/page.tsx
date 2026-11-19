"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useFetch } from "@/hooks/useFetch";
import { Badge } from "@/components/ui/Badge";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";
import { Pagination } from "@/components/ui/Pagination";
import type { Customer, Paginated } from "@/types";

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Wait until the user stops typing before calling the API.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, error, loading, reload } = useFetch<Paginated<Customer>>(
    `/customers?page=${page}&search=${encodeURIComponent(debouncedSearch)}`,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-100">Customers</h1>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or company"
          className="w-64 rounded border border-gray-700 bg-gray-800 p-2 text-sm text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-800 bg-gray-900">
        {loading && <LoadingState />}
        {error && <ErrorState message={error} onRetry={reload} />}
        {!loading && !error && data?.data.length === 0 && (
          <EmptyState message="No customers found." />
        )}

        {!loading && !error && data && data.data.length > 0 && (
          <>
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-800 text-gray-400">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Company</th>
                  <th className="p-3">Industry</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Deals</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((c) => (
                  <tr key={c.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50">
                    <td className="p-3">
                      <Link href={`/customers/${c.id}`} className="text-blue-400 hover:underline">
                        {c.name}
                      </Link>
                    </td>
                    <td className="p-3 text-gray-300">{c.company}</td>
                    <td className="p-3 text-gray-300">{c.industry ?? "—"}</td>
                    <td className="p-3"><Badge value={c.status} /></td>
                    <td className="p-3 text-center text-gray-300">{c.deals_count ?? 0}</td>
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