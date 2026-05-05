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
    <div className="min-h-screen flex items-center justify-center bg-cream px-4 relative overflow-hidden">

      {/* Decorative blobs — same language as public site hero */}
      <div
        className="absolute pointer-events-none"
        style={{ top: "-8%", right: "-10%", width: 500, height: 500,
          background: "#E8C77A", borderRadius: "40% 60% 65% 35% / 50% 45% 55% 50%", opacity: 0.18 }}
      />
      <div
        className="absolute pointer-events-none"
        style={{ bottom: "-14%", left: "-10%", width: 440, height: 440,
          background: "#C5D4B5", borderRadius: "60% 40% 35% 65% / 45% 60% 40% 55%", opacity: 0.22 }}
      />

      <div className="relative z-10 w-full max-w-[400px]">

        {/* Card */}
        <div className="bg-white rounded-3xl px-10 py-10 shadow-xl border border-navy/[0.06]">

          {/* Logo block */}
          <div className="flex flex-col items-center mb-8">
            <div className="mb-4">
              <LogoMark />
            </div>
            <div className="font-fraunces text-[26px] font-extrabold text-navy leading-none tracking-tight">GoHorn</div>
            <div className="text-[10px] font-semibold text-green uppercase tracking-[3px] mt-1">Admin Panel</div>
          </div>

          <p className="font-fraunces text-[22px] font-bold text-navy text-center mb-6 leading-tight">
            Welcome back.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-warm-700 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-navy/[0.12] bg-white text-sm text-navy placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-green/40 focus:border-green transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-warm-700 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-navy/[0.12] bg-white text-sm text-navy placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-green/40 focus:border-green transition"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3.5 rounded-full bg-green text-white font-semibold text-[15px] transition-all duration-300 hover:bg-green-dark hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0"
              style={{ boxShadow: "0 8px 24px rgba(63,174,137,0.28)" }}
            >
              {loading ? "Signing in…" : "Sign in →"}
            </button>

          </form>
        </div>

        <p className="text-center text-warm-500 text-[12px] mt-5">
          GoHorn Detailing · Admin access only
        </p>
      </div>
    </div>
  );
}
