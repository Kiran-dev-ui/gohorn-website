import Link from "next/link";
import LogoMark from "./LogoMark";
import PhoneLink from "./PhoneLink";

export default function Footer() {
  return (
    <footer className="bg-navy text-cream pt-[60px] pb-8 px-12 border-t border-white/[0.08]">
      <div
        className="max-w-[1280px] mx-auto mb-12"
        style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "60px" }}
      >
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-3 no-underline text-cream mb-4">
            <LogoMark />
            <span className="font-fraunces font-extrabold text-[22px]">GoHorn</span>
          </Link>
          <p className="text-cream/60 text-sm max-w-xs leading-relaxed">
            Local car detailing for the Lake George and Mt. Pleasant community. Open every day, fair prices, honest work.
          </p>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-fraunces text-base font-bold mb-4">Services</h4>
          {["Express Wash & Wax", "Interior Refresh", "Full Detail", "Add-ons"].map((s) => (
            <Link
              key={s}
              href="/services"
              className="block text-cream/60 no-underline py-1.5 text-sm hover:text-green-light transition-colors"
            >
              {s}
            </Link>
          ))}
        </div>

        {/* Visit */}
        <div>
          <h4 className="font-fraunces text-base font-bold mb-4">Visit</h4>
          <span className="block text-cream/60 py-1.5 text-sm">304 Lake George Ave</span>
          <span className="block text-cream/60 py-1.5 text-sm">Lake George, MI 48863</span>
          <span className="block text-cream/60 py-1.5 text-sm">Daily 9 AM to 8 PM</span>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-fraunces text-base font-bold mb-4">Contact</h4>
          <PhoneLink light className="block text-cream/60 py-1.5 text-sm hover:text-green-light transition-colors" />
          <a
            href="mailto:horn@unicorn.love"
            className="block text-cream/60 no-underline py-1.5 text-sm hover:text-green-light transition-colors"
          >
            horn@unicorn.love
          </a>
        </div>
      </div>

      <div
        className="max-w-[1280px] mx-auto pt-8 border-t border-white/[0.08] flex justify-between text-cream/50"
        style={{ fontSize: 13 }}
      >
        <span>© 2026 GoHorn Car Detailing. All rights reserved.</span>
        <span>Made with care in Lake George, MI</span>
      </div>
    </footer>
  );
}
