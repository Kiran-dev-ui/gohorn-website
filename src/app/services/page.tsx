import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const PACKAGES = [
  {
    id: "express",
    tag: "Quickest",
    tagClass: "bg-green text-white",
    name: "Express Wash & Wax",
    price: "$69",
    tagline: "A quick refresh when your car needs to look its best without taking your whole afternoon. Hand washed, waxed, and dressed inside and out.",
    time: "About 1 hour",
    img: "https://images.unsplash.com/photo-1694678505383-676d78ea3b96?w=900&q=80&auto=format&fit=crop",
    alt: "Hand washing a car with sponge",
    includes: ["Hand wash, exterior", "Wax and shine treatment", "Wheels deep cleaned", "Tires dressed", "Quick interior vacuum", "Surfaces wipe down"],
    reverse: false,
  },
  {
    id: "interior",
    tag: "Most Popular",
    tagClass: "bg-yellow text-navy",
    name: "Interior Refresh",
    price: "$149",
    tagline: "A full interior makeover. Deep vacuum, shampooed carpets, conditioned surfaces, and a treatment that kills lingering odors.",
    time: "2 to 3 hours",
    img: "https://images.unsplash.com/photo-1605437241278-c1806d14a4d9?w=900&q=80&auto=format&fit=crop",
    alt: "Clean car interior",
    includes: ["Deep vacuum, all areas", "Carpet and mat shampoo", "All interior surfaces cleaned", "Odor treatment", "Window cleaning", "Dashboard conditioning"],
    reverse: true,
  },
  {
    id: "full",
    tag: "Premium",
    tagClass: "bg-navy text-cream",
    name: "Full Detail",
    price: "$239",
    tagline: "The works. Everything in our other packages plus polish, paint correction, stain removal, and pet hair extraction. Your car, restored.",
    time: "4 to 5 hours",
    img: "https://images.unsplash.com/photo-1619431856706-ca2cc58258f6?w=900&q=80&auto=format&fit=crop",
    alt: "Fully detailed BMW with shine",
    includes: [
      "Everything in Express Wash", "Everything in Interior Refresh",
      "Polish and paint correction", "Stain removal treatment",
      "Pet hair removal", "Trim restoration",
      "Headliner cleaning", "Final inspection and detail",
    ],
    reverse: false,
  },
];

const COMPARE_ROWS = [
  { label: "Hand wash exterior",       express: "✓",     interior: "—",    full: "✓" },
  { label: "Wax & shine",              express: "✓",     interior: "—",    full: "✓" },
  { label: "Wheels & tires",           express: "✓",     interior: "—",    full: "✓" },
  { label: "Deep interior vacuum",     express: "Quick", interior: "✓",    full: "✓" },
  { label: "Carpet & mat shampoo",     express: "—",     interior: "✓",    full: "✓" },
  { label: "Odor treatment",           express: "—",     interior: "✓",    full: "✓" },
  { label: "Polish & paint correction",express: "—",     interior: "—",    full: "✓" },
  { label: "Pet hair removal",         express: "—",     interior: "—",    full: "✓" },
  { label: "Stain removal",            express: "—",     interior: "—",    full: "✓" },
];

const ADDONS = [
  {
    name: "Ceramic Coating",
    slug: "ceramic",
    desc: "Long lasting protection that makes water bead off and keeps your paint looking new for months.",
    icon: (
      <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
    ),
  },
  {
    name: "Pet Hair Deep Clean",
    slug: "pet_hair",
    desc: "For cars with serious shedding situations. Specialized tools to lift hair from every fabric and crevice.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12h8M12 8v8" />
      </>
    ),
  },
  {
    name: "Headlight Restoration",
    slug: "headlights",
    desc: "Cloudy or yellow headlights? We sand, polish, and seal them back to clear, restoring nighttime visibility.",
    icon: (
      <>
        <circle cx="12" cy="12" r="5" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" />
      </>
    ),
  },
  {
    name: "Engine Bay Cleaning",
    slug: "engine",
    desc: "A clean engine bay isn't just for show — it helps you spot leaks faster and looks great when you pop the hood.",
    icon: (
      <>
        <rect x="3" y="6" width="18" height="13" rx="2" />
        <path d="M8 6V4M16 6V4M3 11h18" />
      </>
    ),
  },
  {
    name: "Heavy Stain Removal",
    slug: "stains",
    desc: "Coffee, ink, mystery spots from years ago. Targeted treatment for stains that a regular shampoo won't touch.",
    icon: (
      <path d="M12 2C8 6 6 9 6 13a6 6 0 0012 0c0-4-2-7-6-11z" />
    ),
  },
  {
    name: "Deep Odor Treatment",
    slug: "odor",
    desc: "Smoke, food, pets, or just years of life. Our ozone treatment neutralizes odors at the source.",
    icon: (
      <path d="M3 6c5 0 5 6 0 6M21 6c-5 0-5 6 0 6M3 18c5 0 5-6 0-6M21 18c-5 0-5-6 0-6" />
    ),
  },
  {
    name: "Clay Bar Treatment",
    slug: "clay",
    desc: "Removes stuck-on contaminants from your paint that washing alone can't get. Makes paint feel glass smooth.",
    icon: (
      <path d="M3 17l6-6 4 4 8-8M14 7h7v7" />
    ),
  },
  {
    name: "Leather Conditioning",
    slug: "leather",
    desc: "Premium leather treatment that cleans, conditions, and protects. Keeps seats supple and prevents cracking.",
    icon: (
      <>
        <rect x="4" y="6" width="16" height="12" rx="2" />
        <path d="M8 10h8M8 14h6" />
      </>
    ),
  },
];

function CellValue({ val, colIdx }: { val: string; colIdx: number }) {
  const isCheck = val === "✓";
  const isDash = val === "—";
  return (
    <div
      className={`px-4 lg:px-6 py-[18px] text-center text-[15px] border-l border-navy/[0.06] ${colIdx === 1 ? "bg-green/[0.05]" : ""} ${isCheck ? "text-green font-extrabold text-lg" : isDash ? "text-warm-300" : "text-warm-700 font-medium"}`}
    >
      {val}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <>
      <Nav />

      {/* PAGE HERO */}
      <section className="relative pt-36 pb-20 px-4 sm:px-6 lg:px-12 overflow-hidden">
        <div className="absolute z-[0] opacity-60" style={{ top: -80, right: -100, width: 420, height: 420, background: "#E8C77A", borderRadius: "40% 60% 65% 35% / 50% 45% 55% 50%" }} />
        <div className="absolute z-[0]" style={{ bottom: -80, left: -60, width: 300, height: 300, background: "#B5A8D4", borderRadius: "60% 40% 35% 65% / 45% 60% 40% 55%", opacity: 0.3 }} />
        <div className="max-w-[760px] mx-auto text-center relative z-[1]">
          <span className="section-label">Services</span>
          <h1 className="display mb-6" style={{ fontSize: "clamp(36px, 6vw, 72px)" }}>
            Pick a package.<br />Add what you <em className="italic text-green-dark">need.</em>
          </h1>
          <p className="text-lg text-warm-700 max-w-xl mx-auto" style={{ lineHeight: 1.6 }}>
            Three core packages cover most cars, most days. Tailored extras for the deeper jobs. Final price always confirmed by phone, no surprises.
          </p>
        </div>
      </section>

      {/* PACKAGES IN DETAIL */}
      <section className="px-4 sm:px-6 lg:px-12 pb-8">
        <div className="max-w-[1280px] mx-auto">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-[60px] py-10 lg:py-20 border-b border-navy/[0.08] last:border-0"
            >
              {/* Photo — always first on mobile, alternates on desktop */}
              <div className={pkg.reverse ? "order-1 lg:order-2" : "order-1"}>
                <div className="relative rounded-[24px] overflow-hidden" style={{ aspectRatio: "4/3" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pkg.img} alt={pkg.alt} className="w-full h-full object-cover" loading="lazy" />
                  <span className={`absolute top-5 left-5 z-[2] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${pkg.tagClass}`}>
                    {pkg.tag}
                  </span>
                </div>
              </div>

              {/* Detail copy */}
              <div className={pkg.reverse ? "order-2 lg:order-1" : "order-2"}>
                <h2
                  className="font-fraunces mb-3"
                  style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, lineHeight: 1.1 }}
                >
                  {pkg.name}
                </h2>
                <div className="flex items-baseline gap-2 mb-5">
                  <span className="text-sm text-warm-500 uppercase tracking-wider font-semibold">Starting at</span>
                  <span className="font-fraunces font-extrabold text-green-dark leading-none" style={{ fontSize: 44 }}>
                    {pkg.price}
                  </span>
                </div>
                <p className="text-[17px] text-warm-700 mb-7" style={{ lineHeight: 1.6 }}>{pkg.tagline}</p>

                <div className="flex gap-6 mb-7 flex-wrap">
                  <span className="flex items-center gap-1.5 text-sm text-warm-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3FAE89" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                    {pkg.time}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-warm-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3FAE89" strokeWidth="2"><path d="M3 12l2-2 4 4 8-8 4 4" /></svg>
                    Mobile or in shop
                  </span>
                </div>

                <div className="bg-warm-100 rounded-2xl px-5 lg:px-7 py-6 mb-7">
                  <h4 className="text-[11px] font-bold uppercase tracking-[1.5px] text-warm-500 mb-4">
                    What&apos;s Included
                  </h4>
                  <ul className="grid gap-x-5 gap-y-2 grid-cols-1 sm:grid-cols-2">
                    {pkg.includes.map((item) => (
                      <li key={item} className="relative pl-6 text-sm text-navy">
                        <span className="absolute left-0 text-green font-bold">&#10003;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href={`/book?service=${pkg.id}`} className="btn btn-primary">
                  Book {pkg.name.split(" ")[0]} &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="py-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1280px] mx-auto">
          <span className="section-label">Quick Compare</span>
          <h2 className="display mb-4" style={{ fontSize: "clamp(30px, 5vw, 56px)" }}>Side by side.</h2>
          <p className="text-lg text-warm-700 max-w-2xl mb-12">Not sure which package fits your car? Here&apos;s everything in one view.</p>

          <div className="overflow-x-auto">
            <div className="bg-white rounded-[24px] overflow-hidden border border-navy/[0.08] min-w-[560px]">
              {/* Header */}
              <div className="grid" style={{ gridTemplateColumns: "1.5fr 1fr 1fr 1fr" }}>
                <div className="bg-navy px-4 lg:px-6 py-5" />
                {["Express Wash", "Interior Refresh", "Full Detail"].map((col, i) => (
                  <div key={col} className={`bg-navy text-cream px-4 lg:px-6 py-5 font-fraunces font-bold text-[15px] lg:text-[17px] text-center border-l border-white/10 ${i === 1 ? "bg-navy-light" : ""}`}>
                    {col}
                  </div>
                ))}
              </div>
              {/* Feature rows */}
              {COMPARE_ROWS.map((row, i) => (
                <div
                  key={row.label}
                  className="grid border-t border-navy/[0.06]"
                  style={{ gridTemplateColumns: "1.5fr 1fr 1fr 1fr", background: i % 2 === 1 ? "#F5F5F0" : "white" }}
                >
                  <div className="px-4 lg:px-6 py-[18px] font-semibold text-navy text-[14px] lg:text-[15px]">{row.label}</div>
                  <CellValue val={row.express} colIdx={0} />
                  <CellValue val={row.interior} colIdx={1} />
                  <CellValue val={row.full} colIdx={2} />
                </div>
              ))}
              {/* Price row */}
              <div className="grid border-t border-navy/10 bg-warm-100" style={{ gridTemplateColumns: "1.5fr 1fr 1fr 1fr" }}>
                <div className="px-4 lg:px-6 py-5 font-fraunces text-[15px] lg:text-[17px] text-navy font-bold">Starting at</div>
                {[{ price: "$69", hi: false }, { price: "$149", hi: true }, { price: "$239", hi: false }].map(({ price, hi }) => (
                  <div key={price} className={`px-4 lg:px-6 py-5 text-center font-bold text-green-dark text-[15px] lg:text-[17px] border-l border-navy/[0.06] ${hi ? "bg-green/[0.05]" : ""}`}>
                    {price}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-center mt-8 text-warm-500 text-sm">Final price varies by vehicle size and confirmed when you book.</p>
        </div>
      </section>

      {/* ADD-ONS */}
      <section className="bg-navy text-cream py-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1280px] mx-auto">
          <span className="section-label text-green-light">Add-ons</span>
          <h2 className="display text-cream mb-4" style={{ fontSize: "clamp(30px, 5vw, 56px)" }}>
            Tailor it to your <em className="italic text-green-light">car.</em>
          </h2>
          <p className="text-cream/70 text-lg mb-12 max-w-2xl" style={{ lineHeight: 1.6 }}>
            Stack any add-on onto any package. We&apos;ll quote each one based on your vehicle when you book.
          </p>

          <div className="grid gap-4 mb-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {ADDONS.map((addon) => (
              <Link
                key={addon.name}
                href={`/quote?addon=${addon.slug}`}
                className="group relative block rounded-2xl p-7 border border-white/[0.08] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-green no-underline"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <div
                  className="absolute top-0 right-0 w-20 h-20 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(63,174,137,0.15) 0%, transparent 70%)" }}
                />
                <div className="w-12 h-12 bg-green rounded-xl flex items-center justify-center mb-4">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    {addon.icon}
                  </svg>
                </div>
                <h3 className="font-fraunces text-[22px] font-bold text-cream mb-1.5">{addon.name}</h3>
                <div className="text-green-light text-sm font-semibold mb-3">Quote on request</div>
                <p className="text-cream/70 text-sm leading-relaxed">{addon.desc}</p>
                <div className="absolute bottom-4 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-green-light text-xs font-semibold flex items-center gap-1">
                  Get a quote →
                </div>
              </Link>
            ))}
          </div>

          <div
            className="rounded-[20px] p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-green/30"
            style={{ background: "rgba(63,174,137,0.1)" }}
          >
            <div>
              <h3 className="font-fraunces text-[24px] font-bold mb-1">Need something we didn&apos;t list?</h3>
              <p className="text-cream/70 text-sm">Reach out and tell us what your car needs. We&apos;ll figure it out.</p>
            </div>
            <Link href="/quote" className="btn btn-green flex-shrink-0">Get a custom quote &rarr;</Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="text-center py-16 px-4 sm:px-6 lg:px-12 bg-cream">
        <h2 className="display mb-5" style={{ fontSize: "clamp(30px, 5vw, 56px)" }}>
          Ready to make it <em className="italic text-green-dark">shine?</em>
        </h2>
        <p className="text-[18px] text-warm-700 max-w-[540px] mx-auto mb-8" style={{ lineHeight: 1.6 }}>
          Pick a service, pick a time, we handle the rest. Or get a quote first if you want a price before booking.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/book" className="btn btn-green btn-lg">Book your detail &rarr;</Link>
          <Link href="/quote" className="btn btn-ghost btn-lg">Get a quote first</Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
