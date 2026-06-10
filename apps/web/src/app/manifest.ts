import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CodeCraft AI",
    short_name: "CodeCraft",
    description: "آکادمی فارسی کدنویسی، هوش مصنوعی و بازی‌سازی برای نوجوانان.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d0e12",
    theme_color: "#0d0e12",
    dir: "rtl",
    lang: "fa-IR",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      }
    ]
  };
}
