//apps/site/src/components/cms/AdminChrome.tsx

//*******MAYBE DELETE!!!!!!!!! */

// moving admin chrome and layout to app rather than blocks 
// because it's possible to use next here 
// (and we need Link, usePathname, and ReactNode)

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export function AdminChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/case-studies/new', label: 'New Case Study' },
  ];

  return (
    <div className="c-page">
      <aside className="c-sidebar">
        <h1 className="type-h3">ERA Admin</h1>
        <nav className="c-stack">
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  'c-nav-link' + (isActive ? ' c-nav-link--active' : '')
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="c-main">{children}</main>
    </div>
  );
}
