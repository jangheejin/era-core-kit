'use client';

import React, { useState } from 'react';
import { renderBlock } from '@/utils/renderBlock';
import type { LayoutBlock } from '@kit/blocks';

const initialData: LayoutBlock[] = [
  {
    type: 'Hero',
    props: {
      heading: 'Welcome to the site!',
      subhead: 'This is a subheading',
      imageUrl: '/hero.jpg',
    },
    _key: 'hero-1',
  },
  {
    type: 'Callout',
    props: {
      content: 'This is a callout.',
    },
    _key: 'callout-1',
  },
];

export default function EditPage() {
  const [blocks, setBlocks] = useState<LayoutBlock[]>(initialData);

  return (
    <main>
      <h1>Edit Page Layout</h1>

      {blocks.map((block, index) => (
        <div key={block._key ?? `${block.type}-${index}`} style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
          <strong>{block.type}</strong>
          <div>{renderBlock(block, index)}</div>
          {/* You can add an inline form here to edit each block */}
        </div>
      ))}
    </main>
  );
}
