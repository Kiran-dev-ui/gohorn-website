"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAdminBrowserClient } from "@/lib/supabase-browser";
import LogoMark from "@/components/LogoMark";

export default function AdminLoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createAdminBrowserClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/admin/bookings");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy px-4">

      {/* subtle background blob */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: "-20%", right: "-15%",
          width: 500, height: 500,
          background: "radial-gradient(circle, #3FAE89 0%, transparent 65%)",
          opacity: 0.08,
        }}
      />

      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <LogoMark />
          <div className="text-left">
            <div className="font-fraunces text-2xl font-extrabold text-cream leading-none">GoHorn</div>
            <div className="text-[11px] text-cream/50 uppercase tracking-[2px] mt-0.5">Admin Panel</div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <h1 className="font-fraunces text-xl font-bold text-navy mb-6">
            Sign in
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-warm-700 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-warm-300 text-sm text-navy placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-warm-700 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-warm-300 text-sm text-navy placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent transition"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-2.5 rounded-lg bg-green text-white text-sm font-semibold hover:bg-green-dark transition disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>

          </form>
        </div>

        <p className="text-center text-warm-500 text-xs mt-6">
          GoHorn Detailing · Admin access only
        </p>
      </div>
    </div>
  );
}
