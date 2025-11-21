//apps/site/app/admin/layout.tsx
'use client';

import type { ReactNode } from 'react';
import { AdminCaseStudyProvider } from './AdminCaseStudyStore';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminCaseStudyProvider>{children}</AdminCaseStudyProvider>;
}