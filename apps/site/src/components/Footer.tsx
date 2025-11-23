// apps/site/src/components/layout/Footer.tsx
'use client';

import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="c-container site-footer__inner">
        <div className="site-footer__brand">
          <span className="site-footer__brand-name">
            ERA Government Affairs
          </span>
          <p className="type-small site-footer__tagline">
            Federal advocacy & business consulting in Washington, D.C.
          </p>
        </div>

        <nav className="site-footer__nav">
          <Link href="/" className="site-footer__link">
            Home
          </Link>
          <a href="#case-studies" className="site-footer__link">
            Our Work
          </a>
          <Link href="/our-team" className="site-footer__link">
            Our Team
          </Link>
          <a href="#mission" className="site-footer__link">
            Mission
          </a>
          <a href="#contact" className="site-footer__link site-footer__link--primary">
            Contact
          </a>
        </nav>

        <p className="site-footer__legal type-small">
          © {year} ERA Government Affairs, LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
