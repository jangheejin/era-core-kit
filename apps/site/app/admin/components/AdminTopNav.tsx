// apps/site/app/admin/components/AdminTopNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { 
  href: string; 
  label: string; 
/*   activeIfStartsWith?: string; */
  startsWith?: string;
};

/* const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", activeIfStartsWith: "/admin" },
  { href: "/admin/case-studies/list", label: "Case Studies", activeIfStartsWith: "/admin/case-studies" },
  { href: "/admin/client-pages", label: "Client Pages", activeIfStartsWith: "/admin/client-pages" },
  { href: "/", label: "Public site" },
];
 */
const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard" },
  // THIS is the “database view”. Label it for humans:
  { href: "/admin/case-studies/list", label: "Case Study Library", startsWith: "/admin/case-studies" },
  { href: "/admin/client-pages", label: "Client Pages", startsWith: "/admin/client-pages" },
];
/* function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
} */

/* function isActive(pathname: string, item: NavItem) {
  if (!item.activeIfStartsWith) return pathname === item.href;
  if (item.href === "/admin") return pathname === "/admin";
  return pathname.startsWith(item.activeIfStartsWith);
}
 */
function isActive(pathname: string, item: NavItem) {
  if (item.href === "/admin") return pathname === "/admin";
  if (item.startsWith) return pathname.startsWith(item.startsWith);
  return pathname === item.href;
}

export function AdminTopNav() {
  const pathname = usePathname() ?? "";

  return (
    <div className="adminTopNav">
      <div className="adminTopNav__inner">
        {/* <div className="adminTopNav__brand"> */}
        <div className="adminTopNav__left">
          <Link href="/admin" className="adminTopNav__brand">
            Demo CMS
          </Link>
{/*           <Link href="/admin" className="adminTopNav__brandLink">
            Demo CMS
          </Link> */}
        </div>

        <nav className="adminTopNav__links" aria-label="Admin navigation">
          {NAV.map((item) => {
            const active = isActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
/*                 className={
                  active ? "adminTopNav__link is-active" : "adminTopNav__link"
                } */
                className={`adminTopNav__link ${active ? "adminTopNav__link--active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="adminTopNav__right">
        <Link className="adminTopNav__Link" href="/admin/case-studies/new">
          + New Case Study
        </Link>

        <Link className="adminTopNav__Link" href="/">
          Public Site
        </Link>
      </div>
    </div>
  );
}
