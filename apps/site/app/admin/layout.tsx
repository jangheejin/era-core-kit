//apps/site/app/admin/layout.tsx

// ROUTE LAYOUT

'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { AdminCaseStudyProvider } from './AdminCaseStudyStore';
import { MockCMSProvider } from '@/cms/mockCmsStore';
import { AdminShell } from '@/cms/AdminShell';


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

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminCaseStudyProvider>
      <MockCMSProvider>
        {children}
      </MockCMSProvider>
    </AdminCaseStudyProvider>
  );
}