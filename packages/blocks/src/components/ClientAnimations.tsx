//packages/blocks/src/components/ClientAnimations.tsx
'use client';

import { useEffect } from 'react';

export function ClientAnimations() {
  useEffect(() => {
    // safe to access window, trigger animations, etc.
    console.log('Run client animation');
  }, []);

  return null;
}