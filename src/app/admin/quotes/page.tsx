import { redirect } from "next/navigation";
import { createAdminServerClient } from "@/lib/supabase-server";
import QuotesTable, { type Quote } from "./QuotesTable";

export const metadata = { title: "Quotes — GoHorn Admin" };

export default async function QuotesPage() {
  const supabase = createAdminServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false });

  const quotes: Quote[] = data ?? [];

  return (
    <div className="p-5 lg:p-8">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="font-fraunces text-2xl font-bold text-navy">Quotes</h1>
          <span className="px-2.5 py-1 rounded-full bg-navy text-cream text-[12px] font-bold">
            {quotes.length}
          </span>
        </div>
        <p className="text-warm-500 text-sm mt-1">
          {quotes.length === 0
            ? "No quote requests yet."
            : `${quotes.length} quote request${quotes.length !== 1 ? "s" : ""} total — newest first.`}
        </p>
        {error && (
          <p className="mt-2 text-sm text-red-600">Failed to load: {error.message}</p>
        )}
      </div>

      <QuotesTable initialData={quotes} />
    </div>
  );
}
