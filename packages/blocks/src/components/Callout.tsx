// packages/blocks/src/components/Callout.tsx
import React from 'react';
import type { CalloutProps } from '../types';

export function Callout({ content }: CalloutProps) {
  return (
    <div className="callout">{content}</div>
  );
}
