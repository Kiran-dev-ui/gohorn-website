"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

// ─── Photo upload config ──────────────────────────────────────────────────────
const ALLOWED_TYPES  = ["image/jpeg", "image/png"];
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_PHOTOS     = 5;

function validatePhotos(files: File[]): string {
  const combined = files;
  if (combined.length > MAX_PHOTOS) return `Maximum ${MAX_PHOTOS} photos allowed.`;
  for (const f of combined) {
    if (!ALLOWED_TYPES.includes(f.type)) {
      return `"${f.name}" is not supported. Please use JPG or PNG.`;
    }
    if (f.size > MAX_FILE_BYTES) {
      const mb = (f.size / 1024 / 1024).toFixed(1);
      return `"${f.name}" is ${mb} MB — must be under 10 MB.`;
    }
  }
  return "";
}

async function uploadPhotos(files: File[]): Promise<string[]> {
  const uploadedPaths: string[] = [];
  const urls: string[] = [];

  try {
    for (const file of files) {
      const ext  = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `quotes/${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage
        .from("quote-photos")
        .upload(path, file, { contentType: file.type });

      if (error) throw new Error(`Failed to upload "${file.name}": ${error.message}`);

      uploadedPaths.push(path);

      const { data } = supabase.storage
        .from("quote-photos")
        .getPublicUrl(path);

      urls.push(data.publicUrl);
    }
    return urls;
  } catch (err) {
    // Clean up any already-uploaded files so we don't leave orphans
    if (uploadedPaths.length > 0) {
      await supabase.storage.from("quote-photos").remove(uploadedPaths);
    }
    throw err;
  }
}

// ─── Static data ──────────────────────────────────────────────────────────────

const TIMELINE = [
  { title: "You send the request", desc: "Fill out this form. Takes about 2 minutes." },
  { title: "We review your car", desc: "We look at the details, photos if you sent any, and figure out a fair price." },
  { title: "We text or call back", desc: "Usually within an hour. Quote with no pressure to book." },
  { title: "You decide", desc: "If you like the price, we lock in a time. If not, no hard feelings." },
];

const ISSUES = [
  { value: "pet_hair",   label: "🐕 Pet hair" },
  { value: "stains",     label: "🧴 Heavy stains" },
  { value: "odor",       label: "💨 Bad odor" },
  { value: "mold",       label: "🧫 Mold or mildew" },
  { value: "paint",      label: "✨ Paint correction needed" },
  { value: "headlights", label: "💡 Cloudy headlights" },
  { value: "ceramic",    label: "🛡 Ceramic coating interest" },
  { value: "engine",     label: "🔧 Engine bay cleaning" },
];

const CHECKBOX_ADDONS = ["pet_hair", "stains", "headlights", "ceramic", "engine"];
const NOTES_ADDONS: Record<string, string> = {
  clay:    "I'm interested in Clay Bar Treatment",
  leather: "I'm interested in Leather Conditioning",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function FormSection({
  num, title, desc, children, id,
}: {
  num: number; title: string; desc?: string; children: React.ReactNode; id?: string;
}) {
  return (
    <div id={id} className="mb-9">
      <h3 className="flex items-center gap-3 font-fraunces text-[22px] font-bold mb-1.5">
        <span className="w-8 h-8 rounded-full bg-green text-white flex items-center justify-center text-sm font-bold font-sans flex-shrink-0">
          {num}
        </span>
        {title}
      </h3>
      {desc && <p className="text-sm text-warm-500 mb-6 pl-11">{desc}</p>}
      {children}
    </div>
  );
}

function SuccessCard() {
  return (
    <div className="form-card text-center" style={{ padding: "60px 32px" }}>
      <div className="w-20 h-20 rounded-full bg-green flex items-center justify-center mx-auto mb-6 animate-pop">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="display mb-3" style={{ fontSize: 36 }}>Got it! We&apos;ll be in touch.</h2>
      <p className="text-[17px] text-warm-700 max-w-[480px] mx-auto mb-8" style={{ lineHeight: 1.6 }}>
        Your quote request is on its way to us. Expect a call or text from{" "}
        <span className="text-green-dark font-bold">1-856-843-4676</span> within an hour during business hours.
      </p>
      <Link href="/" className="btn btn-primary">Back to home</Link>
    </div>
  );
}

function filterPhoneChars(raw: string): string {
  return raw.replace(/[^\d\s()\-+]/g, "");
}

function validatePhone(value: string): string {
  if (!value.trim()) return "Phone number is required";
  const digits = value.replace(/\D/g, "");
  if (digits.length < 10) return "Please enter a valid phone number with at least 10 digits";
  return "";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function QuotePage() {
  const [submitted, setSubmitted]         = useState(false);
  const [photos, setPhotos]               = useState<File[]>([]);
  const [photoError, setPhotoError]       = useState("");
  const [uploadStatus, setUploadStatus]   = useState("");
  const [phone, setPhone]                 = useState("");
  const [phoneError, setPhoneError]       = useState("");
  const [checkedIssues, setCheckedIssues] = useState<string[]>([]);
  const [notes, setNotes]                 = useState("");
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [submitError, setSubmitError]     = useState("");
  const [locationPref, setLocationPref]   = useState<"shop" | "mobile">("shop");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const addon = params.get("addon");
    if (!addon) return;

    if (CHECKBOX_ADDONS.includes(addon)) {
      setCheckedIssues([addon]);
      setTimeout(() => {
        document.getElementById("section-issues")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else if (NOTES_ADDONS[addon]) {
      setNotes(NOTES_ADDONS[addon]);
      setTimeout(() => {
        document.getElementById("section-notes")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = ""; // reset so same file can be re-selected after removal
    if (picked.length === 0) return;

    const combined = [...photos, ...picked];
    const err = validatePhotos(combined);
    if (err) {
      setPhotoError(err);
      return;
    }
    setPhotoError("");
    setPhotos(combined);
  }

  function removePhoto(idx: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
    setPhotoError("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Collect form data immediately — before any awaits — so currentTarget stays valid
    const fd = new FormData(e.currentTarget);

    const err = validatePhone(phone);
    if (err) { setPhoneError(err); return; }

    setIsSubmitting(true);
    setSubmitError("");

    // Upload photos first if any are selected
    let photoUrls: string[] = [];
    if (photos.length > 0) {
      setUploadStatus(`Uploading ${photos.length} photo${photos.length !== 1 ? "s" : ""}…`);
      try {
        photoUrls = await uploadPhotos(photos);
      } catch (uploadErr) {
        setSubmitError(
          uploadErr instanceof Error
            ? uploadErr.message
            : "Photo upload failed. Please try again."
        );
        setIsSubmitting(false);
        setUploadStatus("");
        return;
      }
      setUploadStatus("Saving your request…");
    }

    const res = await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name:    fd.get("name")     as string,
        customer_phone:   phone,
        customer_email:   fd.get("email")    as string,
        vehicle_year:    (fd.get("year")     as string) || null,
        vehicle_make:    (fd.get("make")     as string) || null,
        vehicle_model:   (fd.get("model")    as string) || null,
        vehicle_size:    (fd.get("size")     as string) || null,
        service_interest:(fd.get("service")  as string) || null,
        issues:           checkedIssues,
        location:        (fd.get("location") as string) || null,
        address:         (fd.get("address")  as string) || null,
        notes:            notes || null,
        photo_urls:       photoUrls,
      }),
    });

    setUploadStatus("");

    if (!res.ok) {
      setSubmitError("Something went wrong sending your request. Please try again.");
      setIsSubmitting(false);
      return;
    }

    setSubmitted(true);
    window.scrollTo({ top: 200, behavior: "smooth" });
  }

  const canAddMore = photos.length < MAX_PHOTOS;

  return (
    <>
      <Nav />

      {/* PAGE HERO */}
      <section className="relative pt-40 pb-16 px-4 sm:px-6 lg:px-12 overflow-hidden text-center">
        <div
          className="absolute z-[0] opacity-50"
          style={{ top: 100, right: -60, width: 240, height: 240, background: "#E8C77A", borderRadius: "40% 60% 65% 35% / 50% 45% 55% 50%" }}
        />
        <div
          className="absolute z-[0]"
          style={{ bottom: -100, left: -60, width: 280, height: 280, background: "#B5A8D4", borderRadius: "60% 40% 35% 65% / 45% 60% 40% 55%", opacity: 0.4 }}
        />
        <div className="relative z-[1] max-w-[700px] mx-auto">
          <span className="section-label">Free Quote</span>
          <h1 className="display mb-5" style={{ fontSize: "clamp(36px, 6vw, 80px)" }}>
            Tell us about<br />your <em className="italic text-green-dark">ride.</em>
          </h1>
          <p className="text-[19px] text-warm-700 max-w-[600px] mx-auto" style={{ lineHeight: 1.6 }}>
            Send us the basics, and we&apos;ll text or call back with a price tailored to your car. No obligation, no pressure. Usually under an hour during open hours.
          </p>
        </div>
      </section>

      {/* FORM + SIDEBAR */}
      <section className="pb-24 px-4 sm:px-6 lg:px-12" style={{ paddingTop: 40 }}>
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 lg:[grid-template-columns:1fr_380px] gap-8 lg:gap-12 items-start">

            {/* LEFT: FORM or SUCCESS STATE */}
            {submitted ? <SuccessCard /> : (
              <div className="form-card">
                <form onSubmit={handleSubmit}>

                  {/* 1. CONTACT INFO */}
                  <FormSection num={1} title="Your contact info" desc="So we know who to call back with the quote.">
                    <div className="grid gap-5 mb-5 grid-cols-1 sm:grid-cols-2">
                      <div className="field">
                        <label>Full name <span className="required">*</span></label>
                        <input type="text" name="name" required placeholder="Your name" />
                      </div>
                      <div className="field">
                        <label>Phone number <span className="required">*</span></label>
                        <input
                          type="tel"
                          inputMode="tel"
                          name="phone"
                          placeholder="(555) 123-4567"
                          value={phone}
                          onChange={e => {
                            const filtered = filterPhoneChars(e.target.value);
                            setPhone(filtered);
                            if (phoneError) setPhoneError(validatePhone(filtered));
                          }}
                          onBlur={() => setPhoneError(validatePhone(phone))}
                          style={phoneError ? { borderColor: "#e53e3e" } : {}}
                        />
                        {phoneError && <span className="text-xs" style={{ color: "#e53e3e" }}>{phoneError}</span>}
                      </div>
                    </div>
                    <div className="field">
                      <label>Email <span className="required">*</span></label>
                      <input type="email" name="email" required placeholder="you@example.com" />
                      <span className="helper">We&apos;ll send the quote here too, just in case you miss our call.</span>
                    </div>
                  </FormSection>

                  {/* 2. VEHICLE */}
                  <FormSection num={2} title="About your vehicle" desc="Helps us figure out the right pricing for your car size.">
                    <div className="grid gap-5 mb-5 grid-cols-1 sm:grid-cols-3">
                      <div className="field">
                        <label>Year</label>
                        <input type="number" name="year" placeholder="2020" min="1950" max="2027" />
                      </div>
                      <div className="field">
                        <label>Make</label>
                        <input type="text" name="make" placeholder="Toyota" />
                      </div>
                      <div className="field">
                        <label>Model</label>
                        <input type="text" name="model" placeholder="Camry" />
                      </div>
                    </div>
                    <div className="field">
                      <label>Vehicle size <span className="required">*</span></label>
                      <div className="grid gap-3 mt-1 grid-cols-1 sm:grid-cols-3">
                        {[
                          { value: "small",  title: "Small",  meta: "Sedan, coupe, hatchback" },
                          { value: "medium", title: "Medium", meta: "Mid-size SUV, crossover" },
                          { value: "large",  title: "Large",  meta: "Full SUV, truck, van" },
                        ].map((opt) => (
                          <label key={opt.value} className="option-card">
                            <input type="radio" name="size" value={opt.value} required />
                            <div className="option-title">{opt.title}</div>
                            <div className="option-meta">{opt.meta}</div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </FormSection>

                  {/* 3. SERVICE INTEREST */}
                  <FormSection num={3} title="What service are you interested in?" desc="Pick the closest fit. We can adjust when we talk.">
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                      {[
                        { value: "express",  title: "Express Wash & Wax", meta: "Quick refresh, exterior focus",   price: "From $69" },
                        { value: "interior", title: "Interior Refresh",    meta: "Deep interior cleaning",          price: "From $149" },
                        { value: "full",     title: "Full Detail",         meta: "Everything inside and out",       price: "From $239" },
                      ].map((svc) => (
                        <label key={svc.value} className="option-card">
                          <input type="radio" name="service" value={svc.value} required />
                          <div className="option-title">{svc.title}</div>
                          <div className="option-meta">{svc.meta}</div>
                          <div className="option-price">{svc.price}</div>
                        </label>
                      ))}
                      <label className="option-card col-span-full">
                        <input type="radio" name="service" value="custom" />
                        <div className="option-title">Not sure / Custom</div>
                        <div className="option-meta">Describe what you need below, we&apos;ll figure it out together</div>
                      </label>
                    </div>
                  </FormSection>

                  {/* 4. SPECIFIC ISSUES */}
                  <FormSection id="section-issues" num={4} title="Anything specific?" desc="Check anything that applies. Affects our quote.">
                    <div className="grid gap-2.5 grid-cols-2">
                      {ISSUES.map((issue) => (
                        <label key={issue.value} className="issue-pill">
                          <input
                            type="checkbox"
                            name="issues"
                            value={issue.value}
                            checked={checkedIssues.includes(issue.value)}
                            onChange={e => {
                              if (e.target.checked) {
                                setCheckedIssues(prev => [...prev, issue.value]);
                              } else {
                                setCheckedIssues(prev => prev.filter(v => v !== issue.value));
                              }
                            }}
                          />
                          {issue.label}
                        </label>
                      ))}
                    </div>
                  </FormSection>

                  {/* 5. WHERE */}
                  <FormSection num={5} title="Where would you like the service?" desc="No extra charge either way.">
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                      <label className="option-card" onClick={() => setLocationPref("shop")}>
                        <input type="radio" name="location" value="shop" defaultChecked onChange={() => setLocationPref("shop")} />
                        <div className="option-title">🏠 At our shop</div>
                        <div className="option-meta">304 Lake George Ave</div>
                      </label>
                      <label className="option-card" onClick={() => setLocationPref("mobile")}>
                        <input type="radio" name="location" value="mobile" onChange={() => setLocationPref("mobile")} />
                        <div className="option-title">🚐 Come to me</div>
                        <div className="option-meta">We&apos;ll come to your location</div>
                      </label>
                    </div>
                    {locationPref === "mobile" && (
                      <div className="field mt-4">
                        <label>Your address <span className="required">*</span></label>
                        <input
                          type="text"
                          name="address"
                          placeholder="Street, city, state, zip"
                        />
                        <span className="helper">Helps us plan when we call to confirm your quote.</span>
                      </div>
                    )}
                  </FormSection>

                  {/* 6. PHOTOS */}
                  <FormSection num={6} title="Add photos (optional)" desc="A photo of your interior or exterior helps us quote more accurately.">

                    {/* Upload area — hidden when at limit */}
                    {canAddMore && (
                      <label className="flex flex-col items-center text-center cursor-pointer rounded-2xl p-6 border-2 border-dashed border-navy/20 bg-warm-100 transition-all hover:border-green hover:bg-green/[0.04]">
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                          multiple
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <div className="w-12 h-12 rounded-xl bg-green flex items-center justify-center mb-3">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M12 4v16M4 12h16" />
                          </svg>
                        </div>
                        <div className="font-semibold text-[15px] mb-1">
                          {photos.length === 0 ? "Click to add photos" : `Add more (${photos.length} / ${MAX_PHOTOS})`}
                        </div>
                        <div className="text-sm text-warm-500">JPG or PNG · Max 10 MB each · Up to 5 photos</div>
                      </label>
                    )}

                    {/* Validation error */}
                    {photoError && (
                      <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mt-3">
                        {photoError}
                      </p>
                    )}

                    {/* Thumbnail grid */}
                    {photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-3 mt-4">
                        {photos.map((file, idx) => (
                          <div
                            key={idx}
                            className="relative rounded-xl overflow-hidden bg-warm-200"
                            style={{ aspectRatio: "1" }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => removePhoto(idx)}
                              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-navy/75 text-white flex items-center justify-center text-xs leading-none hover:bg-red-600 transition-colors"
                              aria-label={`Remove ${file.name}`}
                            >
                              ✕
                            </button>
                            {/* Filename */}
                            <div className="absolute bottom-0 left-0 right-0 bg-navy/60 px-2 py-1">
                              <p className="text-[10px] text-white truncate leading-tight">{file.name}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {photos.length === MAX_PHOTOS && (
                      <p className="text-xs text-warm-500 mt-3 text-center">
                        5 photos selected. Remove one to add a different photo.
                      </p>
                    )}
                  </FormSection>

                  {/* 7. NOTES */}
                  <FormSection id="section-notes" num={7} title="Anything else we should know?">
                    <div className="field">
                      <textarea
                        name="notes"
                        placeholder="Special requests, timing constraints, questions about pricing, anything you want us to know before we call..."
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                      />
                    </div>
                  </FormSection>

                  {/* SUBMIT */}
                  {submitError && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mt-2">
                      {submitError}
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8 pt-8 border-t border-navy/[0.08]">
                    <span className="text-sm text-warm-500">
                      {uploadStatus || "We'll get back to you within an hour during business hours (9 AM to 8 PM, every day)."}
                    </span>
                    <button type="submit" className="btn btn-green btn-lg flex-shrink-0" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          {uploadStatus || "Sending…"}
                        </span>
                      ) : "Send my quote request →"}
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* RIGHT: SIDEBAR */}
            <aside
              className="bg-navy text-cream rounded-[24px] overflow-hidden relative lg:sticky lg:top-[100px]"
              style={{ padding: "36px 32px" }}
            >
              <div
                className="absolute rounded-full pointer-events-none"
                style={{ top: "-50%", right: "-30%", width: 300, height: 300, background: "radial-gradient(circle, #3FAE89 0%, transparent 60%)", opacity: 0.2 }}
              />
              <div className="relative z-[2]">
                <h3 className="font-fraunces text-[26px] font-extrabold mb-3 leading-tight">How it works</h3>
                <p className="text-cream/70 text-sm mb-7" style={{ lineHeight: 1.6 }}>
                  Quotes are quick and free. Here&apos;s the order of things:
                </p>

                <div>
                  {TIMELINE.map((step, i) => (
                    <div key={step.title} className="flex gap-4 pb-6 relative">
                      {i < TIMELINE.length - 1 && (
                        <div
                          className="absolute w-[2px]"
                          style={{ left: 15, top: 32, bottom: 0, background: "rgba(255,255,255,0.15)" }}
                        />
                      )}
                      <div className="w-8 h-8 rounded-full bg-green flex items-center justify-center text-sm font-bold flex-shrink-0 relative z-[2]">
                        {i + 1}
                      </div>
                      <div>
                        <h5 className="font-fraunces text-[16px] font-bold mb-1">{step.title}</h5>
                        <p className="text-cream/70 text-[13px]" style={{ lineHeight: 1.5 }}>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-white/10 my-6" />

                <h4 className="font-fraunces text-[16px] mb-4">Need it faster?</h4>
                <div className="flex flex-col gap-3">
                  <a
                    href="tel:18568434676"
                    className="flex items-center gap-2.5 no-underline transition-colors"
                    style={{ color: "rgba(250,247,240,0.85)", fontSize: 14 }}
                  >
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(63,174,137,0.2)" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5DC4A2" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                      </svg>
                    </span>
                    Call 1-856-THE-HORN
                  </a>
                  <a
                    href="mailto:horn@unicorn.love"
                    className="flex items-center gap-2.5 no-underline transition-colors"
                    style={{ color: "rgba(250,247,240,0.85)", fontSize: 14 }}
                  >
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(63,174,137,0.2)" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5DC4A2" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </span>
                    horn@unicorn.love
                  </a>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
