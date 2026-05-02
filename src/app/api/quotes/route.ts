import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendQuoteNotification } from "@/lib/resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();

  // 1. Save to Supabase
  const { error: dbError } = await supabase.from("quotes").insert({
    customer_name:    body.customer_name,
    customer_phone:   body.customer_phone,
    customer_email:   body.customer_email,
    vehicle_year:     body.vehicle_year     ?? null,
    vehicle_make:     body.vehicle_make     ?? null,
    vehicle_model:    body.vehicle_model    ?? null,
    vehicle_size:     body.vehicle_size     ?? null,
    service_interest: body.service_interest ?? null,
    issues:           body.issues           ?? [],
    location:         body.location         ?? null,
    photo_urls:       [],
    notes:            body.notes            ?? null,
  });

  if (dbError) {
    console.error("[quotes] Supabase error:", dbError);
    return NextResponse.json({ error: "Failed to save quote request." }, { status: 500 });
  }

  // 2. Send email notification (non-blocking — never fails the user)
  try {
    await sendQuoteNotification(body);
  } catch (emailError) {
    console.error("[quotes] Resend error:", emailError);
  }

  return NextResponse.json({ ok: true });
}
