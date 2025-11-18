// packages/blocks/src/components/Callout.tsx
// REACT COMPONENT FOR CALLOUT
import React from 'react';
import type { CalloutProps } from '../types';

export function Callout({ content }: CalloutProps) {
  return (
    <div className="callout">{content}</div>
  );
}
