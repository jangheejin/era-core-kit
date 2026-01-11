// apps/site/app/admin/components/AdminTopNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string };

const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/case-studies/list", label: "Case studies" },
  { href: "/admin/client-pages", label: "Client pages" },
  { href: "/", label: "Public site" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

export function AdminTopNav() {
  const pathname = usePathname() ?? "";

  return (
    <div className="adminTopNav">
      <div className="adminTopNav__inner">
        <div className="adminTopNav__brand">
          <Link href="/admin" className="adminTopNav__brandLink">
            Demo CMS
          </Link>
        </div>

        <nav className="adminTopNav__links" aria-label="Admin">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active ? "adminTopNav__link is-active" : "adminTopNav__link"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
