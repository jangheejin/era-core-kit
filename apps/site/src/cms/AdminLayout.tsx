//apps/site/src/cms/AdminLayout.tsx
// simple/dummy client shell for the CMS
'use client';
//import React from 'react';
import type { ReactNode } from 'react';

type AdminLayoutProps = {
  children: ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/case-studies/new', label: 'New Case Study' },
  ];

  return (
    <div className="cms-shell">
      <aside className="cms-sidebar">
        <div className="cms-logo">ERA CMS</div>
        <nav className="cms-nav">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="cms-nav-link">
              {item.label}
            </a>
          ))}
        </nav>
      </aside>
      <main className="cms-main">{children}</main>
    </div>
  );
}