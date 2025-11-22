//apps/site/app/edit/page.tsx
'use client';

import React, { useState } from 'react';
import type { LayoutBlock } from '@kit/blocks';
import BlockRenderer from '@/utils/BlockRenderer';

// Define the component props interface (Good practice for types)
interface InlineEditFormProps {
    block: LayoutBlock;
    onUpdate: (newProps: any) => void;
}

const InlineEditForm = ({ block, onUpdate }: InlineEditFormProps) => {
  // In a real application, this component would render inputs based on block.type 
  return (
    <div className="block-edit-form"> 
      <strong>Inline Form:</strong> Editing {block.type} Props
    </div>
  );
};

const initialData: LayoutBlock[] = [
  {
    type: 'Hero',
    props: {
      heading: 'Welcome to the site!',
      subhead: 'Here is where you can edit pages',
      text: '',
      text2: '',
      text3: '',
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
        <div key={block._key ?? `${block.type}-${index}`} className="block-edit-wrapper">
          <strong>{block.type}</strong>
          
          <div>
            <BlockRenderer block={block} index={index} /> 
          </div>

          <InlineEditForm block={block} onUpdate={() => {}} />

        </div>
      ))}
    </main>
  );
}
