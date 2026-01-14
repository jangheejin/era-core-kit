// apps/site/app/admin/components/AdminTopNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";//needed for improved sticky header

type NavItem = { 
  href: string; 
  label: string; 
/*   activeIfStartsWith?: string; */
  match?: (pathname: string) => boolean;
  kind?: "normal" | "primary";
};

/* const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", activeIfStartsWith: "/admin" },
  { href: "/admin/case-studies/list", label: "Case Studies", activeIfStartsWith: "/admin/case-studies" },
  { href: "/admin/client-pages", label: "Client Pages", activeIfStartsWith: "/admin/client-pages" },
  { href: "/", label: "Public site" },
];
 */
/*const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/case-studies/list", label: "Case Study Library", startsWith: "/admin/case-studies" },
  { href: "/admin/client-pages", label: "Client Pages", startsWith: "/admin/client-pages" },
; ]*/

/*const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/case-studies/list", label: "Case Study Library" },
   { href: "/admin/client-pages", label: "Client Pages" },
]; */

const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", match: (p) => p === "/admin" },
  /* { href: "/admin/case-studies/list", label: "Case Study Database", match: (p) => p.startsWith("/admin/case-studies") }, */
  { href: "/admin/case-studies/list", label: "Case Study Library", match: (p) => p.startsWith("/admin/case-studies") },
  { href: "/admin/case-studies/new", label: "+ New Case Study", match: (p) => p.startsWith("/admin/case-studies/new"), kind: "primary" },
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
  if (item.href === "/admin/case-studies/list")
    return pathname === "/admin/case-studies/list" || pathname.startsWith("/admin/case-studies/list/");
  if (item.href === "/admin/client-pages")
    return pathname === "/admin/client-pages" || pathname.startsWith("/admin/client-pages/");
  return pathname === item.href;
}

export function AdminTopNav() {
  const pathname = usePathname() ?? "";

  //improved sticky header (appear below context banner, but stick to top)
  const headerRef = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const setVar = () => {
      const h = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--adminTopNavH", `${h}px`);
    };

    setVar();

    const ro = new ResizeObserver(() => setVar());
    ro.observe(el);

    window.addEventListener("resize", setVar);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setVar);
    };
  }, []);
  

  return (
    <header ref={headerRef} className="adminTopNav">
    {/* <div className="adminTopNav"> */}
      <div className="adminTopNav__inner">
        {/* <div className="adminTopNav__brand"> */}
        <div className="adminTopNav__left">
          {/* <Link href="/admin" className="adminTopNav__brand"> */}
{/*           <div className="adminTopNav__brand">
            Demo CMS
          </div> */}
          <div className="adminTopNav__brand">
            Case Study CMS
          </div>
          {/* </Link> */}
{/*           <Link href="/admin" className="adminTopNav__brandLink">
            Demo CMS
          </Link> */}
        </div>
        <div className="adminTopNav__spacer" />
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
                aria-current={active ? "page" : undefined}
                /* className={`adminTopNav__link ${active ? "adminTopNav__link--active" : ""}`} */
                /* className={`adminTopNav__tab ${active ? "is-active" : ""}`} */
                className={[
                  "adminTopNav__pill",
                  active ? "is-active" : "",
                  item.kind === "primary" ? "is-primary" : "",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      
{/*         <div className="adminTopNav__right">
          <Link className="adminTopNav__btn" href="/admin/case-studies/new">
            + New Case Study
          </Link>

          <Link className="adminTopNav__btn adminTopNav__btn--ghost" href="/">
            Public Site
          </Link>
        </div> */}

      </div>
    {/* </div> */}
    </header>
  );
}
