import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: "CodeCraft AI | آکادمی کدکرافت",
    template: "%s | CodeCraft AI"
  },
  description: "آکادمی فارسی کدنویسی، هوش مصنوعی و بازی‌سازی برای نوجوانان.",
  applicationName: "CodeCraft AI",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg"
  }
};

export const viewport: Viewport = {
  themeColor: "#0d0e12",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa-IR" dir="rtl">
      <body className={vazirmatn.className}>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
