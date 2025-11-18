//apps/site/app/layout.tsx
import '../styles/tokens.css';
import '../styles/primitives.css';
import { type Metadata } from 'next';
//import { Inter, Oswald } from 'next/font/google';
//import type { Metadata } from "next";
//const { Inter } = require('next/font/google');
//const { Oswald } = require('next/font/google');
import * as GoogleFonts from 'next/font/google';
import { Inter, Oswald } from 'next/font/google/index';
//import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], display: 'swap', adjustFontFallback: false})


/*
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
});*/
/*const inter = GoogleFonts.Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const oswald = GoogleFonts.Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
});*/

const site = {
  name: "ERA Government Affairs",
  url: "https://www.example.com", // set real domain
  description:
    "ERA Government Affairs is a premier government affairs, consulting and public affairs firm",
  twitter: "@example", //set real twitter
  locale: "en_US"
};

//const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
//const oswald = Oswald({ subsets: ['latin'], weight: ['600'], variable: '--font-heading' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    title: site.name,
    description: site.description,
    siteName: site.name,
    locale: site.locale,
    images: [
      { url: "/og/default.png", width: 1200, height: 630, alt: site.name },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: site.twitter,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable}`}>
      <body>{children}</body>
    </html>
  );
}