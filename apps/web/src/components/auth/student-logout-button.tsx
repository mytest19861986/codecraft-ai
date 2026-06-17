"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function StudentLogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onLogout() {
    setIsSubmitting(true);

    try {
      await fetch("/api/v1/student/session", {
        method: "DELETE"
      });
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <button
      className="rounded-md border border-[#ff6b9d]/35 bg-[#ff6b9d]/10 px-4 py-2 text-sm font-black text-[#ffd6e5] transition hover:border-[#ff6b9d]/70 hover:bg-[#ff6b9d]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b9d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0e12] disabled:cursor-wait disabled:opacity-70"
      disabled={isSubmitting}
      onClick={onLogout}
      type="button"
    >
      {isSubmitting ? "در حال خروج..." : "خروج"}
    </button>
  );
}
