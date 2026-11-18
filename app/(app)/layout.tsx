"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, tokenStore } from "@/lib/api";

const links = [
  { href: "/customers", label: "Customers" },
  { href: "/deals", label: "Deals" },
  { href: "/report", label: "Sales Report" },
  { href: "/assistant", label: "Deal Assistant" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!tokenStore.get()) {
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, [router]);

  async function logout() {
    try {
      await api("/logout", { method: "POST" });
    } finally {
      tokenStore.clear();
      router.replace("/login");
    }
  }

  if (!ready) return null;

  return (
    <div className="min-h-screen">
        <nav className="flex items-center gap-6 border-b border-gray-800 bg-gray-900 px-6 py-3">
        <span className="font-semibold text-gray-100">CRM Assistant</span>
        {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-gray-300 hover:text-blue-400">
            {l.label}
            </Link>
        ))}
        <button onClick={logout} className="ml-auto text-sm text-gray-400 hover:text-red-400">
            Log out
        </button>
        </nav>
        <main className="mx-auto max-w-5xl p-6">{children}</main>
    </div>
    );
}