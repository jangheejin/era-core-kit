//apps/site/src/cms/mockCmsStore.tsx

// Client-side only, NO PERSISTENCE
/*
What it does do:
- Every admin route under this provider sees the same `items` + `add`
- The fixtures appear as “seed data”
- Anything you “publish” from the builder shows up in the list
*/
'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CaseStudy as CaseStudyType } from '@kit/schema';
import { CASE_STUDIES_FIXTURE } from '@kit/schema';

type MockCMSState = {
  items: CaseStudyType[];
  add: (cs: CaseStudyType) => void;
};

const MockCMSContext = createContext<MockCMSState | null>(null);

export function MockCMSProvider({ children }: { children: ReactNode }) {
  // Start with the fixture data as our “database”
  const [items, setItems] = useState<CaseStudyType[]>(() => CASE_STUDIES_FIXTURE);

  const value = useMemo(
    () => ({
      items,
      add: (cs: CaseStudyType) => {
        setItems(prev => {
          // overwrite if slug already exists, otherwise append
          const without = prev.filter(existing => existing.slug !== cs.slug);
          return [...without, cs];
        });
      },
    }),
    [items],
  );

  return (
    <MockCMSContext.Provider value={value}>
      {children}
    </MockCMSContext.Provider>
  );
}

export function useMockCMS() {
  const ctx = useContext(MockCMSContext);
  if (!ctx) {
    throw new Error('useMockCMS must be used inside <MockCMSProvider>');
  }
  return ctx;
}