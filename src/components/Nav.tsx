"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoMark from "./LogoMark";

const links = [
  { href: "/services", label: "Services" },
  { href: "/#why", label: "Why Us" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/quote", label: "Get Quote" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] flex justify-between items-center px-12 py-[18px]"
      style={{
        background: "rgba(250, 247, 240, 0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(31, 36, 51, 0.06)",
      }}
    >
      <Link href="/" className="flex items-center gap-3 no-underline">
        <LogoMark />
        <span
          className="font-fraunces font-extrabold text-[22px] text-navy"
        >
          GoHorn
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-9">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`no-underline font-medium text-[15px] transition-colors duration-200 ${
              pathname === link.href
                ? "text-green-dark"
                : "text-navy hover:text-green"
            }`}
          >
            {link.label}
          </Link>
        ))}
        <Link href="/book" className="btn btn-green">
          Book Now →
        </Link>
      </div>
    </nav>
  );
}
