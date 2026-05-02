"use client";
import { useState, useEffect, useMemo, Suspense } from "react";

function filterPhoneChars(raw: string): string {
  return raw.replace(/[^\d\s()\-+]/g, "");
}

function validatePhone(value: string): string {
  if (!value.trim()) return "Phone number is required";
  const digits = value.replace(/\D/g, "");
  if (digits.length < 10) return "Please enter a valid phone number with at least 10 digits";
  return "";
}
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// ─── Constants ───────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: "express",
    name: "Express Wash & Wax",
    desc: "Hand wash, wax, wheels, quick interior",
    price: 69,
    duration: "~1 hour",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M3 13l2-7h14l2 7" />
        <path d="M2 13h20v5a2 2 0 01-2 2h-1a2 2 0 01-2-2v-1H7v1a2 2 0 01-2 2H4a2 2 0 01-2-2v-5z" />
        <circle cx="6.5" cy="16.5" r="1.5" fill="white" />
        <circle cx="17.5" cy="16.5" r="1.5" fill="white" />
      </svg>
    ),
  },
  {
    id: "interior",
    name: "Interior Refresh",
    desc: "Deep vacuum, shampoo, surfaces, odor",
    price: 149,
    duration: "2–3 hrs",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
      </svg>
    ),
  },
  {
    id: "full",
    name: "Full Detail",
    desc: "Everything inside and out, polish, stains, pet hair",
    price: 239,
    duration: "4–5 hrs",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
];

const ADDONS = [
  { value: "ceramic",   label: "Ceramic Coating" },
  { value: "pet_hair",  label: "Pet Hair Deep Clean" },
  { value: "headlight", label: "Headlight Restoration" },
  { value: "engine",    label: "Engine Bay Cleaning" },
  { value: "stains",    label: "Heavy Stain Removal" },
  { value: "odor",      label: "Deep Odor Treatment" },
  { value: "clay",      label: "Clay Bar Treatment" },
  { value: "leather",   label: "Leather Conditioning" },
];

const TIME_SLOTS = ["9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM"];
const UNAVAILABLE = ["11:00 AM", "3:00 PM"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: number }) {
  const labels = ["Service", "Date & Time", "Vehicle", "You"];
  return (
    <div className="flex items-center justify-center py-8 px-4 sm:px-6 overflow-x-auto">
      {labels.map((label, i) => {
        const n = i + 1;
        const done = n < step;
        const active = n === step;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${done ? "bg-navy text-white" : active ? "bg-green text-white" : "bg-white border-2 border-warm-300 text-warm-500"}`}>
                {done ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : n}
              </div>
              <span className={`text-[12px] font-semibold whitespace-nowrap ${active ? "text-navy" : done ? "text-warm-700" : "text-warm-500"}`}>
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div className={`w-6 sm:w-14 h-[2px] mx-1 sm:mx-3 mb-5 flex-shrink-0 transition-colors ${done ? "bg-navy" : "bg-warm-300"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Calendar ─────────────────────────────────────────────────────────────────

function Calendar({ calYear, calMonth, selDate, onMonthChange, onSelect }: {
  calYear: number; calMonth: number; selDate: Date | null;
  onMonthChange: (d: number) => void; onSelect: (date: Date) => void;
}) {
  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  return (
    <div className="bg-white border border-navy/[0.08] rounded-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <span className="font-fraunces font-bold text-[20px]">{MONTHS[calMonth]} {calYear}</span>
        <div className="flex gap-2">
          {([-1, 1] as const).map(d => (
            <button key={d} type="button" onClick={() => onMonthChange(d)}
              className="w-8 h-8 border border-navy/[0.12] rounded-lg flex items-center justify-center text-lg leading-none hover:bg-green hover:text-white hover:border-green transition-all">
              {d === -1 ? "‹" : "›"}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[11px] font-bold text-warm-500 uppercase tracking-wide py-2">{d}</div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const date = new Date(calYear, calMonth, day);
          const isPast = date < today;
          const isToday = date.getTime() === today.getTime();
          const isSel = selDate?.getTime() === date.getTime();
          return (
            <div key={day} role={isPast ? undefined : "button"} tabIndex={isPast ? -1 : 0}
              onClick={() => !isPast && onSelect(date)}
              className={`aspect-square flex items-center justify-center text-[14px] font-medium rounded-lg relative select-none transition-all
                ${isPast ? "text-warm-300 cursor-not-allowed" : "cursor-pointer"}
                ${!isPast && !isSel ? "hover:bg-warm-100" : ""}
                ${isToday && !isSel ? "font-bold" : ""}
                ${isSel ? "bg-green text-white font-bold" : ""}
              `}>
              {day}
              {isToday && (
                <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isSel ? "bg-white" : "bg-green"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Time Slots ───────────────────────────────────────────────────────────────

function TimeSlots({ selDate, selTime, onSelect }: {
  selDate: Date | null; selTime: string | null; onSelect: (t: string) => void;
}) {
  if (!selDate) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 text-warm-500">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-warm-300 mb-3">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
        <p className="text-sm">Pick a date first to see<br />available times.</p>
      </div>
    );
  }
  const dateStr = selDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  return (
    <div>
      <h4 className="font-fraunces text-[18px] font-bold mb-1">{dateStr}</h4>
      <p className="text-sm text-warm-500 mb-4">9 AM to 8 PM. Pick a slot.</p>
      <div className="grid grid-cols-3 gap-2">
        {TIME_SLOTS.map(slot => {
          const unavail = UNAVAILABLE.includes(slot);
          const sel = selTime === slot;
          return (
            <button key={slot} type="button" disabled={unavail}
              onClick={() => !unavail && onSelect(slot)}
              className={`time-slot ${unavail ? "unavailable" : ""} ${sel ? "selected" : ""}`}>
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Booking Sidebar ──────────────────────────────────────────────────────────

function BookingSidebar({ service, serviceName, servicePrice, addons, selDate, selTime, location, vYear, vMake, vModel, vSize }: {
  service: string | null; serviceName: string; servicePrice: number; addons: string[];
  selDate: Date | null; selTime: string | null; location: string;
  vYear: string; vMake: string; vModel: string; vSize: string | null;
}) {
  const dateStr = selDate?.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) ?? null;
  const veh = [vYear, vMake, vModel].filter(Boolean).join(" ") || (vSize ? `${vSize.charAt(0).toUpperCase() + vSize.slice(1)} vehicle` : null);

  const lines = [
    { label: "Service",  value: serviceName || "Pick one",    empty: !service },
    { label: "Add-ons",  value: addons.length ? `${addons.length} selected` : "None", empty: !addons.length },
    { label: "Date",     value: dateStr || "Not picked",      empty: !selDate },
    { label: "Time",     value: selTime || "Not picked",      empty: !selTime },
    { label: "Where",    value: location === "shop" ? "At our shop" : "Mobile (we come to you)", empty: false },
    { label: "Vehicle",  value: veh || "Not added",           empty: !veh },
  ];

  return (
    <aside className="bg-white border border-navy/[0.08] rounded-[24px] p-7 lg:sticky lg:top-[100px]" style={{ boxShadow: "0 8px 30px rgba(31,36,51,0.06)" }}>
      <h3 className="font-fraunces text-[20px] font-bold mb-1">Your booking</h3>
      <p className="text-sm text-warm-500 mb-5">Everything updates as you go.</p>
      {lines.map(({ label, value, empty }) => (
        <div key={label} className="flex justify-between py-3.5 border-b border-navy/[0.06] last:border-0 text-sm">
          <span className="text-warm-500">{label}</span>
          <span className={`font-semibold text-right max-w-[55%] ${empty ? "text-warm-300 italic font-normal" : ""}`}>{value}</span>
        </div>
      ))}
      <div className="bg-warm-100 -mx-7 -mb-7 mt-4 px-7 py-5 rounded-b-[24px]">
        <div className="flex justify-between items-baseline mb-1">
          <span className="font-fraunces text-[13px] text-warm-700 uppercase tracking-[1.5px] font-bold">Starting at</span>
          <span className="font-fraunces text-[26px] font-extrabold text-green-dark">{servicePrice ? `$${servicePrice}` : "$—"}</span>
        </div>
        <p className="text-[12px] text-warm-500" style={{ lineHeight: 1.5 }}>Final price confirmed by phone. Add-ons and size adjustments may apply.</p>
      </div>
    </aside>
  );
}

// ─── Confirmation Card ────────────────────────────────────────────────────────

function ConfirmationCard({ serviceName, addons, selDate, selTime, location, vYear, vMake, vModel, vSize, servicePrice, firstTime }: {
  serviceName: string; addons: string[]; selDate: Date | null; selTime: string | null;
  location: string; vYear: string; vMake: string; vModel: string; vSize: string | null;
  servicePrice: number; firstTime: boolean;
}) {
  const dateStr = selDate?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) ?? "";
  const veh = [vYear, vMake, vModel].filter(Boolean).join(" ") || (vSize ? `${vSize.charAt(0).toUpperCase() + vSize.slice(1)} vehicle` : "Not specified");
  const svcDisplay = serviceName + (addons.length ? ` + ${addons.length} add-on${addons.length > 1 ? "s" : ""}` : "");
  const rows = [
    { label: "Service",     value: svcDisplay },
    { label: "When",        value: `${dateStr}, ${selTime}` },
    { label: "Where",       value: location === "shop" ? "304 Lake George Ave" : "Mobile (your address)" },
    { label: "Vehicle",     value: veh },
    { label: "Starting at", value: `$${servicePrice}${firstTime ? " (20% off applied)" : ""}` },
  ];
  return (
    <div className="form-card text-center max-w-[700px] mx-auto" style={{ padding: "48px 32px" }}>
      <div className="w-[88px] h-[88px] rounded-full bg-green flex items-center justify-center mx-auto mb-7 animate-pop">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="display mb-3" style={{ fontSize: 38 }}>You&apos;re booked!</h2>
      <p className="text-[17px] text-warm-700 max-w-[480px] mx-auto mb-8" style={{ lineHeight: 1.5 }}>
        We&apos;ve got your request. We&apos;ll call you within an hour during business hours to confirm the price and lock in your time.
      </p>
      <div className="bg-warm-100 rounded-2xl p-7 text-left max-w-[440px] mx-auto mb-8">
        {rows.map(row => (
          <div key={row.label} className="flex justify-between py-2.5 text-sm border-b border-navy/[0.06] last:border-0">
            <span className="text-warm-500">{row.label}</span>
            <span className="font-semibold text-right max-w-[60%]">{row.value}</span>
          </div>
        ))}
      </div>
      <p className="text-sm text-warm-500 mb-6">
        A confirmation has been sent to your email. We&apos;ll call from{" "}
        <a href="tel:18568434676" className="phone-link light text-green-dark font-bold" style={{ display: "inline-flex" }}>
          1-856-THE-HORN
          <span className="phone-tooltip">1-856-843-4676</span>
        </a>
      </p>
      <Link href="/" className="btn btn-primary">Back to home</Link>
    </div>
  );
}

// ─── Inner Page (uses useSearchParams) ───────────────────────────────────────

function BookPageInner() {
  const params = useSearchParams();

  // Navigation
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Step 1 — Service
  const [service, setService]           = useState<string | null>(null);
  const [serviceName, setServiceName]   = useState("");
  const [servicePrice, setServicePrice] = useState(0);
  const [addons, setAddons]             = useState<string[]>([]);

  // Step 2 — Date & Time
  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);
  const [calYear, setCalYear]   = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selDate, setSelDate]   = useState<Date | null>(null);
  const [selTime, setSelTime]   = useState<string | null>(null);

  // Step 3 — Vehicle
  const [vYear, setVYear]                       = useState("");
  const [vMake, setVMake]                       = useState("");
  const [vModel, setVModel]                     = useState("");
  const [vSize, setVSize]                       = useState<string | null>(null);
  const [location, setLocation]                 = useState<"shop" | "mobile">("shop");
  const [address, setAddress]                   = useState("");

  // Step 4 — Contact
  const [name, setName]           = useState("");
  const [phone, setPhone]         = useState("");
  const [email, setEmail]         = useState("");
  const [notes, setNotes]         = useState("");
  const [firstTime, setFirstTime] = useState(false);
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError]   = useState("");

  // Pre-select service from URL ?service=
  useEffect(() => {
    const svc = params.get("service");
    if (svc) {
      const found = SERVICES.find(s => s.id === svc);
      if (found) {
        setService(found.id);
        setServiceName(found.name);
        setServicePrice(found.price);
      }
    }
  }, [params]);

  function goToStep(n: number) {
    setStep(n);
    window.scrollTo({ top: 200, behavior: "smooth" });
  }

  function handleMonthChange(delta: number) {
    let m = calMonth + delta, y = calYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setCalYear(y); setCalMonth(m);
  }

  function handleDateSelect(date: Date) {
    setSelDate(date);
    setSelTime(null);
  }

  function toggleAddon(value: string) {
    setAddons(prev => prev.includes(value) ? prev.filter(a => a !== value) : [...prev, value]);
  }

  async function handleSubmit() {
    const errs: Record<string, string> = {};
    if (!name.trim())  errs.name  = "Required";
    const phoneErr = validatePhone(phone);
    if (phoneErr) errs.phone = phoneErr;
    if (!email.trim()) errs.email = "Required";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setIsSubmitting(true);
    setSubmitError("");

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service,
        addons,
        date:                selDate!.toISOString().split("T")[0],
        time:                selTime!,
        vehicle_year:        vYear  || null,
        vehicle_make:        vMake  || null,
        vehicle_model:       vModel || null,
        vehicle_size:        vSize,
        location,
        address:             location === "mobile" ? (address || null) : null,
        customer_name:       name,
        customer_phone:      phone,
        customer_email:      email,
        customer_notes:      notes || null,
        first_time_discount: firstTime,
      }),
    });

    if (!res.ok) {
      setSubmitError("Something went wrong saving your booking. Please try again.");
      setIsSubmitting(false);
      return;
    }

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Shared sidebar props ──
  const sidebarProps = { service, serviceName, servicePrice, addons, selDate, selTime, location, vYear, vMake, vModel, vSize };

  return (
    <>
      <Nav />

      {/* PAGE HERO */}
      {!submitted && (
        <section className="relative pt-40 pb-6 px-4 sm:px-6 lg:px-12 overflow-hidden text-center">
          <div className="absolute z-[0] opacity-50" style={{ top: 80, right: -60, width: 220, height: 220, background: "#E8C77A", borderRadius: "40% 60% 65% 35% / 50% 45% 55% 50%" }} />
          <div className="absolute z-[0]" style={{ bottom: -60, left: -40, width: 220, height: 220, background: "#C5D4B5", borderRadius: "60% 40% 35% 65% / 45% 60% 40% 55%", opacity: 0.5 }} />
          <div className="relative z-[1]">
            <span className="section-label">Book Your Detail</span>
            <h1 className="display mb-4" style={{ fontSize: "clamp(36px, 6vw, 72px)" }}>
              A few steps,<br />and you&apos;re <em className="italic text-green-dark">set.</em>
            </h1>
            <p className="text-[18px] text-warm-700 max-w-[540px] mx-auto" style={{ lineHeight: 1.6 }}>
              Pick your service, time, and we&apos;ll call you to confirm the exact price for your vehicle.
            </p>
          </div>
        </section>
      )}

      {/* STEP INDICATOR */}
      {!submitted && <StepIndicator step={step} />}

      {/* MAIN CONTENT */}
      <section className={submitted ? "pt-24 pb-24 px-4 sm:px-6 lg:px-12" : "pb-24 px-4 sm:px-6 lg:px-12"}>
        <div className="max-w-[1280px] mx-auto">

          {submitted ? (
            <ConfirmationCard
              serviceName={serviceName} addons={addons}
              selDate={selDate} selTime={selTime} location={location}
              vYear={vYear} vMake={vMake} vModel={vModel} vSize={vSize}
              servicePrice={servicePrice} firstTime={firstTime}
            />
          ) : (
            <div className="grid grid-cols-1 lg:[grid-template-columns:1fr_380px] gap-6 lg:gap-8 items-start">

              {/* ── LEFT: STEP CONTENT ── */}
              <div className="form-card">

                {/* STEP 1 — SERVICE */}
                {step === 1 && (
                  <div>
                    <h2 className="font-fraunces text-[28px] font-extrabold mb-2 leading-tight">Pick your service</h2>
                    <p className="text-[15px] text-warm-700 mb-8">Final pricing depends on your vehicle. We&apos;ll confirm by phone after you book.</p>

                    <div className="flex flex-col gap-3.5 mb-8">
                      {SERVICES.map(svc => (
                        <label key={svc.id} className="service-row">
                          <input type="radio" name="service" value={svc.id}
                            checked={service === svc.id}
                            onChange={() => { setService(svc.id); setServiceName(svc.name); setServicePrice(svc.price); }}
                          />
                          <div className="w-12 h-12 bg-green rounded-xl flex items-center justify-center flex-shrink-0">
                            {svc.icon}
                          </div>
                          <div>
                            <h4 className="font-fraunces text-[19px] font-bold mb-0.5">{svc.name}</h4>
                            <p className="text-sm text-warm-500">{svc.desc}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-[11px] text-warm-500 uppercase tracking-wider">From</div>
                            <div className="font-fraunces text-[24px] font-extrabold text-green-dark">${svc.price}</div>
                            <div className="text-[12px] text-warm-500">{svc.duration}</div>
                          </div>
                        </label>
                      ))}
                    </div>

                    <h3 className="font-fraunces text-[18px] font-bold mb-1.5">Add-ons (optional)</h3>
                    <p className="text-[15px] text-warm-700 mb-4">Stack extras if your car needs them. We&apos;ll quote each one when we call.</p>
                    <div className="grid gap-2.5 mb-8 grid-cols-2 sm:grid-cols-4">
                      {ADDONS.map(a => (
                        <label key={a.value} className="addon-pill">
                          <input type="checkbox" name="addons" value={a.value}
                            checked={addons.includes(a.value)}
                            onChange={() => toggleAddon(a.value)}
                          />
                          {a.label}
                        </label>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t border-navy/[0.08] gap-3 flex-wrap">
                      <Link href="/" className="btn btn-ghost">← Cancel</Link>
                      <button type="button" onClick={() => service && goToStep(2)}
                        className="btn btn-primary"
                        style={{ opacity: service ? 1 : 0.45, cursor: service ? "pointer" : "not-allowed" }}>
                        Pick a date →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2 — DATE & TIME */}
                {step === 2 && (
                  <div>
                    <h2 className="font-fraunces text-[28px] font-extrabold mb-2 leading-tight">When works for you?</h2>
                    <p className="text-[15px] text-warm-700 mb-8">We&apos;re open every day, 9 AM to 8 PM. Pick a date, then a time.</p>

                    <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-2">
                      <Calendar calYear={calYear} calMonth={calMonth} selDate={selDate}
                        onMonthChange={handleMonthChange} onSelect={handleDateSelect} />
                      <TimeSlots selDate={selDate} selTime={selTime} onSelect={t => setSelTime(t)} />
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t border-navy/[0.08] gap-3 flex-wrap">
                      <button type="button" onClick={() => goToStep(1)} className="btn btn-ghost">← Back</button>
                      <button type="button" onClick={() => selDate && selTime && goToStep(3)}
                        className="btn btn-primary"
                        style={{ opacity: selDate && selTime ? 1 : 0.45, cursor: selDate && selTime ? "pointer" : "not-allowed" }}>
                        Continue →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3 — VEHICLE */}
                {step === 3 && (
                  <div>
                    <h2 className="font-fraunces text-[28px] font-extrabold mb-2 leading-tight">Tell us about your car</h2>
                    <p className="text-[15px] text-warm-700 mb-8">Helps us match the price to your vehicle when we call to confirm.</p>

                    <div className="grid gap-5 mb-6 grid-cols-1 sm:grid-cols-3">
                      <div className="field"><label>Year</label><input type="number" placeholder="2020" min="1950" max="2027" value={vYear} onChange={e => setVYear(e.target.value)} /></div>
                      <div className="field"><label>Make</label><input type="text" placeholder="Toyota" value={vMake} onChange={e => setVMake(e.target.value)} /></div>
                      <div className="field"><label>Model</label><input type="text" placeholder="Camry" value={vModel} onChange={e => setVModel(e.target.value)} /></div>
                    </div>

                    <h3 className="font-fraunces text-[18px] font-bold mb-3">Vehicle size</h3>
                    <div className="grid gap-3 mb-8 grid-cols-1 sm:grid-cols-3">
                      {[
                        { value: "small",  title: "Small",  meta: "Sedan, coupe, hatchback" },
                        { value: "medium", title: "Medium", meta: "Mid-size SUV, crossover" },
                        { value: "large",  title: "Large",  meta: "Full SUV, truck, van" },
                      ].map(opt => (
                        <label key={opt.value} className="option-card">
                          <input type="radio" name="vSize" value={opt.value} checked={vSize === opt.value} onChange={() => setVSize(opt.value)} />
                          <div className="option-title">{opt.title}</div>
                          <div className="option-meta">{opt.meta}</div>
                        </label>
                      ))}
                    </div>

                    <h3 className="font-fraunces text-[18px] font-bold mb-3">Where would you like the service?</h3>
                    <div className="grid gap-4 mb-5 grid-cols-1 sm:grid-cols-2">
                      {[
                        {
                          value: "shop" as const, title: "At our shop",
                          desc: "Drop off at 304 Lake George Ave. We'll text when it's ready.",
                          icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2h-4v-7H10v7H6a2 2 0 01-2-2z" /></svg>,
                        },
                        {
                          value: "mobile" as const, title: "Come to me",
                          desc: "We'll bring everything to your place. No extra charge.",
                          icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" /></svg>,
                        },
                      ].map(opt => (
                        <label key={opt.value} className="location-card">
                          <input type="radio" name="location" value={opt.value} checked={location === opt.value} onChange={() => setLocation(opt.value)} />
                          <div className="w-11 h-11 bg-green rounded-[10px] flex items-center justify-center mb-3.5">{opt.icon}</div>
                          <h4 className="font-fraunces text-[18px] font-bold mb-1">{opt.title}</h4>
                          <p className="text-sm text-warm-500" style={{ lineHeight: 1.5 }}>{opt.desc}</p>
                        </label>
                      ))}
                    </div>

                    {location === "mobile" && (
                      <div className="field mb-5">
                        <label>Your address</label>
                        <input type="text" placeholder="Street, city, state, zip" value={address} onChange={e => setAddress(e.target.value)} />
                        <span className="helper">Where we&apos;ll meet you to do the work.</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-6 border-t border-navy/[0.08] gap-3 flex-wrap">
                      <button type="button" onClick={() => goToStep(2)} className="btn btn-ghost">← Back</button>
                      <button type="button" onClick={() => goToStep(4)} className="btn btn-primary">Continue →</button>
                    </div>
                  </div>
                )}

                {/* STEP 4 — CONTACT */}
                {step === 4 && (
                  <div>
                    <h2 className="font-fraunces text-[28px] font-extrabold mb-2 leading-tight">Last step. Who do we call?</h2>
                    <p className="text-[15px] text-warm-700 mb-8">We&apos;ll call to confirm the exact price for your car and lock in your booking.</p>

                    <div className="grid gap-5 mb-5 grid-cols-1 sm:grid-cols-2">
                      <div className="field">
                        <label>Full name <span className="required">*</span></label>
                        <input type="text" placeholder="Your name" value={name}
                          onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
                          style={errors.name ? { borderColor: "#e53e3e" } : {}} />
                        {errors.name && <span className="text-xs" style={{ color: "#e53e3e" }}>{errors.name}</span>}
                      </div>
                      <div className="field">
                        <label>Phone number <span className="required">*</span></label>
                        <input
                          type="tel"
                          inputMode="tel"
                          placeholder="(555) 123-4567"
                          value={phone}
                          onChange={e => {
                            const filtered = filterPhoneChars(e.target.value);
                            setPhone(filtered);
                            if (errors.phone) setErrors(p => ({ ...p, phone: validatePhone(filtered) }));
                          }}
                          onBlur={() => setErrors(p => ({ ...p, phone: validatePhone(phone) }))}
                          style={errors.phone ? { borderColor: "#e53e3e" } : {}} />
                        {errors.phone && <span className="text-xs" style={{ color: "#e53e3e" }}>{errors.phone}</span>}
                      </div>
                    </div>
                    <div className="field mb-5">
                      <label>Email <span className="required">*</span></label>
                      <input type="email" placeholder="you@example.com" value={email}
                        onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }}
                        style={errors.email ? { borderColor: "#e53e3e" } : {}} />
                      {errors.email && <span className="text-xs" style={{ color: "#e53e3e" }}>{errors.email}</span>}
                      <span className="helper">We&apos;ll send a booking confirmation here.</span>
                    </div>
                    <div className="field mb-5">
                      <label>Anything we should know? (optional)</label>
                      <textarea placeholder="Special requests, gate codes, parking notes, anything..." value={notes} onChange={e => setNotes(e.target.value)} />
                    </div>

                    <label className="flex items-center gap-3 p-4 rounded-xl cursor-pointer mb-2 border border-green/20" style={{ background: "rgba(63,174,137,0.06)" }}>
                      <input type="checkbox" checked={firstTime} onChange={e => setFirstTime(e.target.checked)}
                        style={{ width: 18, height: 18, accentColor: "#3FAE89", flexShrink: 0 }} />
                      <span className="text-[14px]">
                        <strong>This is my first detail with GoHorn.</strong> Apply 20% Grand Opening discount when calculating final price.
                      </span>
                    </label>

                    {submitError && (
                      <p className="text-sm mt-4" style={{ color: "#e53e3e" }}>{submitError}</p>
                    )}
                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-navy/[0.08] gap-3 flex-wrap">
                      <button type="button" onClick={() => goToStep(3)} className="btn btn-ghost" disabled={isSubmitting}>← Back</button>
                      <button type="button" onClick={handleSubmit} className="btn btn-green btn-lg" disabled={isSubmitting}>
                        {isSubmitting ? "Saving…" : "Confirm booking →"}
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* ── RIGHT: SUMMARY ── */}
              <BookingSidebar {...sidebarProps} />

            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

// ─── Default Export (Suspense wrapper for useSearchParams) ───────────────────

export default function BookPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-warm-500">
        Loading...
      </div>
    }>
      <BookPageInner />
    </Suspense>
  );
}
