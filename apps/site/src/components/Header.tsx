// apps/site/src/components/Header.tsx

//Sticky top navbar

"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="site-header">
      <div className="c-container site-header__inner">
        {/* Brand: logo + wordmark */}
        <div className="site-header__brand">
          <Link href="/" className="site-header__brand-link">
            {/* Logo + wordmark */}
            <span className="site-header__logo-wrap">
              {/* <img
                src="ERA.png"
                alt="ERA Government Affairs logo"
                className="site-header__logo"
              /> */}
              <img
                src="/icon-192.png"
                alt="ERA Government Affairs logo"
                className="site-header__logo"
              />
            </span>
            <span className="site-header__brand-text">
              ERA Government Affairs
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="site-header__nav">
          <a href="/" className="site-header__link">
            Home
          </a>
          <a href="/our-work" className="site-header__link">
            Our Work
          </a>
{/*           <a href="/#mission" className="site-header__link">
            Our Mission
          </a> */}
          <a href="/our-team" className="site-header__link">
            Our Team
          </a>
          <a
            href="/#contact"
            className="site-header__link site-header__link--contact"
          >
            {/* <a href="#contact" className="site-header__link site-header__link--primary"> */}
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
