// apps/site/app/layout.tsx

//'use client';

import '@styles/tokens.css';
import '@styles/primitives.css';
import '@styles/casegrid.css';
import '@styles/home.css'
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { type Metadata } from 'next';
//import { Inter, Oswald } from 'next/font/google';
//import { Inter, Oswald } from 'next/font/google/index';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css'; 
import '@fontsource/inter/600.css'; 
import '@fontsource/oswald/400.css';
import '@fontsource/oswald/500.css';
import '@fontsource/oswald/600.css';
import '@styles/primitives.css';
import '@styles/casegrid.css';

//const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap', adjustFontFallback: false})
//const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald', display: 'swap', adjustFontFallback: false})

const site = {
  name: "ERA Government Affairs",
  url: "https://www.example.com", // set real domain
  description:
    "ERA Government Affairs is a premier government affairs, consulting and public affairs firm",
  twitter: "@example", //set real twitter
  locale: "en_US"
};

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
    <html lang="en" className="font-setup">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}