// apps/site/app/admin/components/AdminTopNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react"; //needed for improved sticky header

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

/* { href: "/admin/case-studies/list", label: "Case Study Database", match: (p) => p.startsWith("/admin/case-studies") }, */
/*   {
    href: "/admin/case-studies/list",
    label: "Case Study Library",
    match: (p) => p.startsWith("/admin/case-studies"),
  }, */

const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", match: (p) => p === "/admin" },
  /* { href: "/admin/case-studies/list", label: "Case Study Database", match: (p) => p.startsWith("/admin/case-studies") }, */
  {
    href: "/admin/case-studies/list",
    label: "Case Studies",
    match: (p) => p.startsWith("/admin/case-studies"),
  },

  {
    href: "/admin/client-pages",
    label: "Case Study Collections",
    match: (p) => p.startsWith("/admin/client-pages"),
  },
  {
    href: "/admin/team",
    label: "Team Bios",
    match: (p) => p.startsWith("/admin/team"),
  },
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
    return (
      pathname === "/admin/case-studies/list" ||
      pathname.startsWith("/admin/case-studies/list/")
    );
  if (item.href === "/admin/client-pages")
    return (
      pathname === "/admin/client-pages" ||
      pathname.startsWith("/admin/client-pages/")
    );
  if (item.href === "/admin/team")
    return pathname === "/admin/team" || pathname.startsWith("/admin/team/");
  return pathname === item.href;
}

function getContextLabel(pathname: string) {
  if (pathname.startsWith("/admin/case-studies")) return "Case Studies CMS";
  if (pathname.startsWith("/admin/client-pages"))
    return "Case Study Collections CMS";
  if (pathname.startsWith("/admin/team")) return "Team Bios CMS";
  return "CMS Admin";
}

export function AdminTopNav() {
  const pathname = usePathname() ?? "";
  const [navOpen, setNavOpen] = useState(false);
  const contextLabel = getContextLabel(pathname);
  const createActive =
    pathname.startsWith("/admin/case-studies/new") ||
    pathname.startsWith("/admin/client-pages/new");

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

          {/* <div className="adminTopNav__brand">CMS Admin</div> */}

          <div className="adminTopNav__brand">
            {contextLabel ?? "CMS Admin"}
          </div>

          {/* </Link> */}
          {/*           <Link href="/admin" className="adminTopNav__brandLink">
            Demo CMS
          </Link> */}
        </div>
        <div className="adminTopNav__spacer" />

        <button
          type="button"
          className="adminTopNav__toggle"
          aria-expanded={navOpen}
          aria-controls="adminTopNavLinks"
          onClick={() => setNavOpen((prev) => !prev)}
        >
          Menu
        </button>

        <nav
          id="adminTopNavLinks"
          className={["adminTopNav__links", navOpen ? "is-open" : ""].join(" ")}
          aria-label="Admin navigation"
        >
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
          <details className="adminTopNav__create">
            <summary
              className={[
                "adminTopNav__pill",
                "is-primary",
                createActive ? "is-active" : "",
              ].join(" ")}
            >
              + Create
            </summary>
            <div className="adminTopNav__createMenu">
              <Link
                className="adminTopNav__createLink"
                href="/admin/case-studies/new"
              >
                New case study
              </Link>
              <Link
                className="adminTopNav__createLink"
                href="/admin/client-pages/new"
              >
                New client page
              </Link>
            </div>
          </details>
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
