import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendBookingNotification } from "@/lib/resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();

  // 1. Save to Supabase
  const { error: dbError } = await supabase.from("bookings").insert({
    service:             body.service,
    addons:              body.addons              ?? [],
    date:                body.date,
    time:                body.time,
    vehicle_year:        body.vehicle_year        ?? null,
    vehicle_make:        body.vehicle_make        ?? null,
    vehicle_model:       body.vehicle_model       ?? null,
    vehicle_size:        body.vehicle_size        ?? null,
    location:            body.location,
    address:             body.address             ?? null,
    customer_name:       body.customer_name,
    customer_phone:      body.customer_phone,
    customer_email:      body.customer_email,
    customer_notes:      body.customer_notes      ?? null,
    first_time_discount: body.first_time_discount ?? false,
  });

  if (dbError) {
    console.error("[bookings] Supabase error:", dbError);
    return NextResponse.json({ error: "Failed to save booking." }, { status: 500 });
  }

  // 2. Send email notification (non-blocking — never fails the user)
  try {
    await sendBookingNotification(body);
  } catch (emailError) {
    console.error("[bookings] Resend error:", emailError);
  }

  return NextResponse.json({ ok: true });
}
