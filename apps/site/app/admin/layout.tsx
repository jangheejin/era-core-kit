//apps/site/app/admin/layout.tsx

// app/layout.tsx is still the outer shell, /app/admin/layout.tsx is inside that shell, wrapping only /admin/*

// ROUTE LAYOUT

"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { AdminCaseStudyProvider } from "./AdminCaseStudyStore";
import AdminProviders from "./AdminProviders";
//import AdminCssWrapper from "./AdminCssWrapper";
//import "@styles/admin.css";
import "@styles/admin-cms.css"
import { AdminTopNav } from "./components/AdminTopNav";
/* export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminCssWrapper>
      <AdminProviders>{children}</AdminProviders>
    </AdminCssWrapper>
  );
}
 */
/* export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminProviders>
      {children}
    </AdminProviders>
  );
} */

//CLIENT-SIDE DEMO-ONLY INTEGRATION OF DEMO CMS WITH PUBLIC SITE
// root layout is wrapped with AdminProviders

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AdminTopNav />
      {children}
    </>
  );
}

//-------------------------------------------------------

//import { MockCMSProvider } from "@/cms/mockCmsStore";
//import { AdminShell } from "@/cms/AdminShell";

// OLD VERSION
// context provider/wrapper
// wraps the whole /admin subtree in AdminCaseStudyProvider
// for some local state/mock database
/*
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminCaseStudyProvider>{children}</AdminCaseStudyProvider>;
}*/

// NEW VERSION
// now wrapping the admin subtree in the provider, mockCmsStore
// to wire the full builder into a shared mock database
// everything is still purely client-side with no persistence

/*
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <MockCMSProvider>
      <AdminShell>
        {children}
      </AdminShell>
    </MockCMSProvider>
  );
}*/

/*export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminCaseStudyProvider>
      <MockCMSProvider>{children}</MockCMSProvider>
    </AdminCaseStudyProvider>
  );
}*/
/* export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminCaseStudyProvider>
      {children}
    </AdminCaseStudyProvider>
  );
} */

/* THE TREE RENDERED BY THIS IS:
<html>
  <body>
    <Header />
    
    <AdminCaseStudyProvider>
      <MockCMSProvider>
          ADMIN PAGE CONTENT
      </MockCMSProvider>
    </AdminCaseStudyProvider>

    <Footer />
  </body>
</html>
*/ 