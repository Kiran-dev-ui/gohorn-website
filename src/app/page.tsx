import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PhoneLink from "@/components/PhoneLink";

function HeroMascot() {
  return (
    <svg className="animate-hero-idle relative z-[2]" style={{ width: "75%" }} viewBox="0 0 60 44" fill="none">
      <path d="M28 4 L31 14 L25 14 Z" fill="white" />
      <path d="M27 8 L29 8" stroke="#3FAE89" strokeWidth="0.7" strokeLinecap="round" />
      <path d="M26.3 11 L29.7 11" stroke="#3FAE89" strokeWidth="0.7" strokeLinecap="round" />
      <path d="M14 22 L18 16 Q22 14 28 14 L36 14 Q40 14 43 17 L48 22 Z" fill="white" />
      <path d="M8 22 L52 22 Q54 22 54 24 L54 30 Q54 32 52 32 L8 32 Q6 32 6 30 L6 24 Q6 22 8 22 Z" fill="white" />
      <path d="M19 17 Q22 15.5 27 15.5 L27 21 L19 21 Z" fill="#3FAE89" />
      <path d="M28 15.5 L36 15.5 Q39 15.5 41 17 L43 21 L28 21 Z" fill="#3FAE89" />
      <line x1="28" y1="22" x2="28" y2="32" stroke="#3FAE89" strokeWidth="0.5" opacity="0.4" />
      <circle cx="50" cy="26" r="1.5" fill="#E8C77A" />
      <circle className="wheel" cx="16" cy="33" r="5" fill="#1F2433" />
      <circle cx="16" cy="33" r="2" fill="white" />
      <circle className="wheel" cx="44" cy="33" r="5" fill="#1F2433" />
      <circle cx="44" cy="33" r="2" fill="white" />
      <g opacity="0.7">
        <path d="M5 8 L5.5 10 L7 10.5 L5.5 11 L5 13 L4.5 11 L3 10.5 L4.5 10 Z" fill="#E8C77A">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
        </path>
        <path d="M52 6 L52.4 7.5 L54 8 L52.4 8.5 L52 10 L51.6 8.5 L50 8 L51.6 7.5 Z" fill="#E8C77A">
          <animate attributeName="opacity" values="1;0.3;1" dur="2.5s" repeatCount="indefinite" />
        </path>
        <path d="M55 38 L55.4 39.5 L57 40 L55.4 40.5 L55 42 L54.6 40.5 L53 40 L54.6 39.5 Z" fill="#E8C77A">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
        </path>
      </g>
    </svg>
  );
}

function ServiceCard({ icon, name, price, items, featured = false }: {
  icon: React.ReactNode; name: string; price: string; items: string[]; featured?: boolean;
}) {
  return (
    <div className={`relative rounded-[24px] p-10 border overflow-hidden transition-all duration-500 hover:-translate-y-2 group ${featured ? "bg-navy text-cream border-transparent" : "bg-white border-navy/[0.06] hover:shadow-[0_24px_60px_rgba(31,36,51,0.1)]"}`}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-green origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      {featured && <span className="absolute top-6 right-6 bg-green text-white px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide">Most Popular</span>}
      <div className="w-[60px] h-[60px] bg-green rounded-2xl flex items-center justify-center text-white mb-6">{icon}</div>
      <h3 className="font-fraunces text-[28px] font-bold mb-2">{name}</h3>
      <div className={`font-fraunces text-xl mb-5 ${featured ? "text-green-light" : "text-green-dark"}`}>
        <span className={`text-[13px] font-medium font-sans ${featured ? "text-cream/60" : "text-warm-500"}`}>starting at </span>{price}
      </div>
      <ul className={`list-none border-t pt-5 space-y-1.5 ${featured ? "border-cream/15" : "border-navy/[0.08]"}`}>
        {items.map((item) => (
          <li key={item} className={`relative pl-6 text-sm ${featured ? "text-cream/80" : ""}`}>
            <span className="absolute left-0 text-green font-bold">&#10003;</span>{item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReviewCard({ text, name, meta, initial }: { text: string; name: string; meta: string; initial: string }) {
  return (
    <div className="bg-white p-8 rounded-[20px] border border-navy/[0.06]">
      <div className="text-[#F5B800] text-lg mb-4 tracking-widest">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <p className="font-fraunces text-lg leading-relaxed text-navy mb-6 font-normal">&ldquo;{text}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-green text-white flex items-center justify-center font-bold text-sm">{initial}</div>
        <div>
          <div className="font-semibold text-[15px]">{name}</div>
          <div className="text-warm-500 text-[13px]">{meta}</div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Nav />

      {/* ── HERO ── */}
      <section className="relative min-h-screen" style={{ padding: "140px 48px 80px", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "60px", alignItems: "center" }}>
        <div className="absolute z-[0] opacity-70" style={{ top: 80, right: -80, width: 280, height: 280, background: "#E8C77A", borderRadius: "40% 60% 65% 35% / 50% 45% 55% 50%" }} />
        <div className="absolute z-[0]" style={{ bottom: -100, left: -60, width: 320, height: 320, background: "#B5A8D4", borderRadius: "60% 40% 35% 65% / 45% 60% 40% 55%", opacity: 0.35 }} />
        <div className="absolute z-[0]" style={{ top: "30%", left: "35%", width: 180, height: 180, background: "#C5D4B5", borderRadius: "50%", opacity: 0.4 }} />

        <div className="relative z-[2]">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-[13px] font-semibold text-green-dark mb-7 border border-navy/[0.08]">
            <span className="w-2 h-2 rounded-full bg-green animate-pulse-dot" />
            Now serving Lake George &amp; Mt. Pleasant
          </span>
          <h1 className="display animate-fade-up mb-7" style={{ fontSize: "clamp(48px, 7vw, 88px)" }}>
            Local care<br />for every <em className="italic text-green-dark font-semibold">ride.</em>
          </h1>
          <p className="animate-fade-up text-warm-700 max-w-xl mb-10" style={{ fontSize: 19, lineHeight: 1.6, animationDelay: "0.1s" }}>
            Hand detailed by people who actually care about your car. From a quick refresh to a full transformation, we treat every vehicle like it&apos;s our own, at fair prices.
          </p>
          <div className="animate-fade-up flex gap-4 flex-wrap mb-12" style={{ animationDelay: "0.2s" }}>
            <Link href="/book" className="btn btn-primary">Book your detail &rarr;</Link>
            <Link href="/services" className="btn btn-ghost">See services</Link>
          </div>
          <div className="animate-fade-up flex gap-12 pt-8 border-t border-navy/10 flex-wrap" style={{ animationDelay: "0.3s" }}>
            {[{ num: "$69", label: "Starting price" }, { num: "9 to 8", label: "Open daily" }, { num: "★ 5.0", label: "Local rating" }].map((s) => (
              <div key={s.label}>
                <div className="font-fraunces text-4xl font-extrabold text-navy">{s.num}</div>
                <div className="text-[13px] text-warm-500 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-[1] w-full aspect-square max-w-[540px] ml-auto animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <div className="animate-float absolute z-[3] bg-cream rounded-2xl flex items-center gap-3" style={{ top: -20, left: -30, padding: "16px 20px", boxShadow: "0 12px 32px rgba(31,36,51,0.12)" }}>
            <div className="w-[42px] h-[42px] bg-green rounded-xl flex items-center justify-center text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
              <div className="text-xs text-warm-500">This week</div>
              <div className="text-[15px] font-bold text-navy">12 details done</div>
            </div>
          </div>
          <div className="animate-float-delay absolute z-[3] bg-cream rounded-2xl flex items-center gap-3" style={{ bottom: 40, right: -40, padding: "16px 20px", boxShadow: "0 12px 32px rgba(31,36,51,0.12)" }}>
            <div className="w-[42px] h-[42px] bg-green rounded-xl flex items-center justify-center text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" /></svg>
            </div>
            <div>
              <div className="text-xs text-warm-500">Customer rating</div>
              <div className="text-[15px] font-bold text-navy">&#9733; 5.0 / 5.0</div>
            </div>
          </div>
          <div className="absolute inset-0 rounded-[32px] overflow-hidden flex items-center justify-center" style={{ background: "linear-gradient(135deg, #2D3142 0%, #1F2433 100%)", boxShadow: "0 30px 80px rgba(31,36,51,0.25)" }}>
            <div className="absolute rounded-full opacity-35" style={{ width: "70%", aspectRatio: "1", background: "radial-gradient(circle, #3FAE89 0%, transparent 70%)" }} />
            <HeroMascot />
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-24 px-12">
        <div className="max-w-[1280px] mx-auto">
          <span className="section-label">Our Services</span>
          <h2 className="display mb-6" style={{ fontSize: "clamp(36px, 5vw, 60px)" }}>
            Three packages.<br />One promise: <em className="italic text-green-dark font-semibold">spotless.</em>
          </h2>
          <p className="text-lg text-warm-700 max-w-2xl mb-16">Pick what fits your car and your day. Every detail starts with a free quote, so there are no surprises and no upsells.</p>
          <div className="grid grid-cols-3 gap-6">
            <ServiceCard name="Express Wash & Wax" price="$69" items={["Hand wash, exterior", "Wax and shine treatment", "Wheels deep cleaned", "Tires dressed", "Quick interior vacuum", "Surfaces wipe down"]} icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 13l2-7h14l2 7"/><path d="M2 13h20v5a2 2 0 01-2 2h-1a2 2 0 01-2-2v-1H7v1a2 2 0 01-2 2H4a2 2 0 01-2-2v-5z"/><circle cx="6.5" cy="16.5" r="1.5" fill="currentColor"/><circle cx="17.5" cy="16.5" r="1.5" fill="currentColor"/></svg>} />
            <ServiceCard name="Interior Refresh" price="$149" featured items={["Deep vacuum, all areas", "Carpet and mat shampoo", "All interior surfaces cleaned", "Odor treatment", "Window cleaning", "Dashboard conditioning"]} icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>} />
            <ServiceCard name="Full Detail" price="$239" items={["Everything in both packages", "Polish and paint correction", "Stain removal treatment", "Pet hair removal", "Trim restoration", "Headliner cleaning"]} icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>} />
          </div>
          <p className="text-center mt-10 text-warm-500 text-sm">Prices vary based on vehicle size. Final quote confirmed when you book.</p>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section id="why" className="bg-navy text-cream py-24 px-12">
        <div className="max-w-[1280px] mx-auto" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
          <div>
            <span className="section-label text-green-light">Why GoHorn</span>
            <h2 className="display text-cream mb-8" style={{ fontSize: "clamp(36px, 5vw, 60px)" }}>
              We came here.<br />We saw the cars.<br />We had to <em className="italic text-green-light font-semibold">help.</em>
            </h2>
            <p className="text-cream/80 text-lg mb-8" style={{ lineHeight: 1.6 }}>A few of us moved to the area looking to do something good for the community we now call home. Car detailing turned out to be that something. We work hard, charge fair, and treat every vehicle with the respect it deserves.</p>
            <Link href="/quote" className="btn btn-green">Get a free quote &rarr;</Link>
          </div>
          <div className="flex flex-col gap-6">
            {[
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L4 7v6c0 5 3 9 8 11 5-2 8-6 8-11V7l-8-5z"/><path d="M9 12l2 2 4-4"/></svg>, title: "Fair, honest pricing", desc: "No upsells, no hidden fees. We charge what the work is worth, often well below chain detailers." },
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>, title: "Open every single day", desc: "9 AM to 8 PM, seven days a week. Weekends, holidays, whenever your car needs us." },
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M3 12l2-2 4 4 8-8 4 4"/></svg>, title: "Mobile or in shop, your call", desc: "Drop your car off at our shop, or have us come to you. Both options, same care." },
            ].map((f) => (
              <div key={f.title} className="flex gap-5 p-6 rounded-2xl border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="flex-shrink-0 w-12 h-12 bg-green rounded-xl flex items-center justify-center">{f.icon}</div>
                <div>
                  <h3 className="font-fraunces text-[22px] font-bold mb-1">{f.title}</h3>
                  <p className="text-cream/70 text-[15px]">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section id="gallery" className="py-24 px-12">
        <div className="max-w-[1280px] mx-auto">
          <div className="relative rounded-[24px] overflow-hidden flex items-center justify-between gap-8 mb-20 bg-green text-white" style={{ padding: "40px 48px" }}>
            <div className="absolute rounded-full pointer-events-none" style={{ top: "-50%", right: "-10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)" }} />
            <div className="relative z-[2]">
              <h3 className="font-fraunces text-[32px] font-bold mb-1">Grand Opening Special: 20% off your first detail</h3>
              <p className="opacity-90 text-[15px]">Just mention this when you book. No code, no hassle.</p>
            </div>
            <Link href="/book" className="btn btn-white relative z-[2]">Claim discount &rarr;</Link>
          </div>

          <span className="section-label">Recent Work</span>
          <h2 className="display mb-6" style={{ fontSize: "clamp(36px, 5vw, 60px)" }}>Cars we&apos;ve made <em className="italic text-green-dark font-semibold">shine.</em></h2>
          <p className="text-lg text-warm-700 max-w-2xl mb-16">A growing portfolio of local rides we&apos;ve brought back to life. New work added every week.</p>

          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "240px 240px" }}>
            <div className="relative rounded-[20px] overflow-hidden cursor-pointer group" style={{ gridColumn: "span 2", gridRow: "span 2" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1665564590635-e5e27629f548?w=1200&q=80&auto=format&fit=crop" alt="Freshly detailed car" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <span className="absolute top-4 left-4 bg-green text-white text-[11px] font-bold uppercase tracking-[1.5px] px-3 py-1.5 rounded-full">Featured</span>
              <span className="absolute bottom-4 left-4 bg-navy/85 text-white text-[13px] font-semibold px-3 py-2 rounded-lg backdrop-blur-sm">Full Detail &middot; Local pickup</span>
            </div>
            {[
              { src: "https://images.unsplash.com/photo-1694678505383-676d78ea3b96?w=600&q=80&auto=format&fit=crop", alt: "Hand washing", label: "Express Wash" },
              { src: "https://images.unsplash.com/photo-1605437241278-c1806d14a4d9?w=600&q=80&auto=format&fit=crop", alt: "Car interior", label: "Interior Refresh", green: true },
              { src: "https://images.unsplash.com/photo-1632823469850-2f77dd9c7f93?w=600&q=80&auto=format&fit=crop", alt: "Waxing hood", label: "Wax & Polish" },
              { src: "https://images.unsplash.com/photo-1567808291548-fc3ee04dbcf0?w=600&q=80&auto=format&fit=crop", alt: "Black car", label: "Full Detail" },
            ].map((item) => (
              <div key={item.src} className="relative rounded-[20px] overflow-hidden cursor-pointer group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt={item.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <span className="absolute bottom-3 left-3 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded" style={{ background: item.green ? "rgba(63,174,137,0.95)" : "rgba(31,36,51,0.9)" }}>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 px-6 py-5 bg-white border border-dashed border-green rounded-[14px] flex items-center justify-center gap-3 flex-wrap text-center">
            <span className="text-[22px]">📸</span>
            <span className="text-sm text-warm-700">Real customer photos coming soon. <Link href="/book" className="text-green-dark font-semibold no-underline hover:underline">Book your detail</Link> and you might see your car here next.</span>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section id="reviews" className="py-24 px-12 bg-warm-100">
        <div className="max-w-[1280px] mx-auto">
          <span className="section-label">What Locals Say</span>
          <h2 className="display mb-6" style={{ fontSize: "clamp(36px, 5vw, 60px)" }}>Word travels fast<br />in a small town.</h2>
          <p className="text-lg text-warm-700 max-w-2xl mb-16">Real reviews from real neighbors. Yours will go here too once you leave one after your detail.</p>
          <div className="grid grid-cols-3 gap-6">
            <ReviewCard initial="M" name="Mike R." meta="Mt. Pleasant, Full Detail" text="Showed up on time, did incredible work on my truck. Cleaner than the day I bought it. Half the price of the chain place I used to go to." />
            <ReviewCard initial="S" name="Sarah K." meta="Lake George, Interior Refresh" text="These guys are amazing. Got the dog hair out of every single corner of my SUV. Friendly, professional, and you can tell they actually care." />
            <ReviewCard initial="D" name="David L." meta="Lake George, Express Wash" text="Best wash I have had around here. Came to my house, did the whole thing in my driveway, no problem. I will be a regular for sure." />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="book" className="relative overflow-hidden bg-navy text-cream text-center py-32 px-12">
        <div className="absolute rounded-full pointer-events-none" style={{ width: 800, height: 800, background: "radial-gradient(circle, #3FAE89 0%, transparent 60%)", opacity: 0.15, top: -300, left: "50%", transform: "translateX(-50%)" }} />
        <h2 className="display text-cream relative mb-6" style={{ fontSize: "clamp(40px, 6vw, 80px)" }}>Ready to book?</h2>
        <p className="text-cream/80 relative max-w-xl mx-auto mb-10" style={{ fontSize: 19 }}>Pick a time that works for you. We&apos;ll call to confirm your quote based on your vehicle, and you&apos;re set.</p>
        <div className="relative flex gap-4 justify-center flex-wrap">
          <Link href="/book" className="btn btn-green">Book online &rarr;</Link>
          <PhoneLink light className="btn btn-ghost-light" />
        </div>
      </section>

      <Footer />
    </>
  );
}
