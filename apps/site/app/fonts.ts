//apps/site/app/fonts.ts

import localFont from "next/font/local";

export const inter = localFont({
  src: [
    {
      path: "./fonts/inter-latin-wght-normal.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "./fonts/inter-latin-wght-italic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-inter",
});

export const oswald = localFont({
  src: [
    {
      path: "./fonts/oswald-latin-wght-normal.woff2",
      weight: "200 700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-oswald",
});
