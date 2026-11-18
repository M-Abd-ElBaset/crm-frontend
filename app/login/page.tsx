"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError, tokenStore } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api<{ token: string }>("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      tokenStore.set(res.token);
      router.push("/customers");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
        <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg border border-gray-800 bg-gray-900 p-6 shadow"
        >
        <h1 className="text-xl font-semibold text-gray-100">CRM Assistant</h1>

        {error && <p className="rounded bg-red-950 p-2 text-sm text-red-300">{error}</p>}

        <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-gray-700 bg-gray-800 p-2 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
        />
        <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-gray-700 bg-gray-800 p-2 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
        />
        <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-500 disabled:opacity-50"
        >
            {loading ? "Signing in..." : "Sign in"}
        </button>
        </form>
    </main>
    );
}