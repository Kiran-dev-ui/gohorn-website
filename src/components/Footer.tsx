import Link from "next/link";
import LogoMark from "./LogoMark";
import PhoneLink from "./PhoneLink";

export default function Footer() {
  return (
    <footer className="bg-navy text-cream pt-14 pb-8 px-4 sm:px-6 lg:px-12 border-t border-white/[0.08]">
      <div className="max-w-[1280px] mx-auto mb-10 grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-[60px] lg:[grid-template-columns:2fr_1fr_1fr_1fr]">

        {/* Brand — full width on smallest mobile */}
        <div className="col-span-2 sm:col-span-1 lg:col-span-1">
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
            href="mailto:info@gohornllc.com"
            className="block text-cream/60 no-underline py-1.5 text-sm hover:text-green-light transition-colors"
          >
            info@gohornllc.com
          </a>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row justify-between gap-2 text-cream/50 text-[13px]">
        <span>© 2026 GoHorn Car Detailing. All rights reserved.</span>
        <span>Made with care in Lake George, MI</span>
      </div>
    </footer>
  );
}
