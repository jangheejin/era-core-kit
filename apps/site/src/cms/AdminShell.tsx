//apps/site/src/cms/AdminShell.tsx
// VISUAL SHELL
// simple/dummy client shell for the CMS
// 'CHROME' only - doesn't know about case studies / CMS stuff
// - sidebar 
// - nav links 
// - wraps {children}
'use client';
//import React from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import '@styles/admin-cms-buttons.css';
import '@styles/admin-cms.css'

type AdminShellProps = {
  children: ReactNode;
};

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/case-studies/new', label: 'New Case Study' },
  // later: { href: '/admin/case-studies/list', label: 'All Case Studies' },
];

export function AdminShell({ children }: AdminShellProps) {
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

      <main className="cms-main">
        {children}
      </main>
    </div>
  );
}