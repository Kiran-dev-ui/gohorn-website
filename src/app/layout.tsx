import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GoHorn Car Detailing | Local Care for Every Ride",
  description:
    "Hand detailed by people who actually care about your car. Serving Lake George and Mt. Pleasant, MI. Open daily 9 AM to 8 PM.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${fraunces.variable} ${inter.variable} font-sans bg-cream text-navy antialiased overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
