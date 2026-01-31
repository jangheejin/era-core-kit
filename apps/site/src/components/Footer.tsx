// apps/site/src/components/Footer.tsx
"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="c-container site-footer__inner">
        <div className="site-footer__brand">
          <Link href="/" className="site-footer__brand-link">
            <span className="site-footer__logo-wrap">
              <img
                src="/icon-192.png"
                alt="ERA Government Affairs logo"
                className="site-footer__logo"
              />
            </span>

            <span className="site-footer__brand-name">
              ERA Government Affairs
            </span>
          </Link>

          <p className="type-small site-footer__tagline">
            Federal advocacy & business consulting
          </p>
        </div>

        <nav className="site-footer__nav">
          <Link href="/" className="site-footer__link">
            Home
          </Link>
          <a href="/our-work" className="site-footer__link">
            Our Work
          </a>
          {/*           <Link href="/#mission" className="site-footer__link">
            Our Mission
          </Link> */}
          <a href="/our-team" className="site-footer__link">
            Our Team
          </a>
          <a
            href="/#contact"
            className="site-footer__link site-footer__link--primary"
          >
            Contact
          </a>
        </nav>

        <p className="site-footer__legal type-small">
          © {year} ERA Government Affairs, LLC. All rights reserved.
          <span className="site-footer__divider" aria-hidden="true">
            •
          </span>
          <a className="site-footer__archive-link" href="/our-work/archive">
            Our Work Archive
          </a>
        </p>
      </div>
    </footer>
  );
}
