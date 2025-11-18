//packages/blocks/src/components/DocLink.tsx
//// REACT COMPONENT FOR DOCLINK
import React from 'react';
import type { DocLinkProps } from '../types';

export function DocLink({ href, children }: DocLinkProps) {
  return (
    <a className="doclink" href={href}>
      {children}
    </a>
  );
}
