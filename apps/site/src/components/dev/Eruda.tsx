"use client";

import Script from "next/script";
import { useSearchParams } from "next/navigation";

export default function Eruda() {
  const sp = useSearchParams();
  const enabled = sp.get("eruda") === "1";

  if (!enabled || process.env.NODE_ENV === "production") return null;

  return (
    <Script
      src="https://cdn.jsdelivr.net/npm/eruda"
      strategy="afterInteractive"
      onLoad={() => {
        const win = window as unknown as { eruda?: { init: () => void } };
        win.eruda?.init();
      }}
    />
  );
}
