//packages/blocks/src/components/PullQuote.tsx
// REACT COMPONENT FOR PULLQUOTE
import React from 'react';
import type { PullQuoteProps } from '../types';

export function PullQuote({ content }: PullQuoteProps) {
  return (
    <div className="pullquote">{content}</div>
  );
}
