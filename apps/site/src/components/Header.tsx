// apps/site/src/components/layout/Header.tsx

//Sticky top navbar

'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-header__brand">
          ERA Government Affairs
        </Link>

        <nav className="site-header__nav">
          <a href="#case-studies" className="site-header__link">
            Our Work
          </a>
          <a href="#mission" className="site-header__link">
            Mission
          </a>
          <a href="#team" className="site-header__link">
            Team
          </a>
          <a href="#contact" className="site-header__link site-header__link--primary">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
