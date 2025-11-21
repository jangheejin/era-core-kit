//apps/site/app/admin/mockCMS.tsx
'use client';

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CaseStudy } from '@kit/schema';
import { CASE_STUDIES_FIXTURE } from '@kit/schema';

type MockCMSState = {
  items: CaseStudy[];
  addCaseStudy: (payload: CaseStudy) => void;
};

const MockCMSContext = createContext<MockCMSState | undefined>(undefined);

export function MockCMSProvider({ children }: { children: ReactNode }) {
  // Start with the fixture data so the “database” doesn’t look empty
  const [items, setItems] = useState<CaseStudy[]>(() => CASE_STUDIES_FIXTURE);

  const addCaseStudy = (payload: CaseStudy) => {
    setItems(prev => {
      const idx = prev.findIndex(
        cs => cs.id === payload.id || cs.slug === payload.slug,
      );

      if (idx === -1) {
        return [...prev, payload];
      }

      // Overwrite existing if same id/slug to avoid dupes
      const next = [...prev];
      next[idx] = payload;
      return next;
    });
  };

  const value = useMemo(() => ({ items, addCaseStudy }), [items]);

  return (
    <MockCMSContext.Provider value={value}>{children}</MockCMSContext.Provider>
  );
}

export function useMockCMS(): MockCMSState {
  const ctx = useContext(MockCMSContext);
  if (!ctx) {
    throw new Error('useMockCMS must be used within <MockCMSProvider>');
  }
  return ctx;
}
