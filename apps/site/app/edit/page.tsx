// apps/site/app/edit/page.tsx
'use client';

import { useState } from 'react';
import type { LayoutBlock } from '@kit/blocks';
import BlockRenderer from '@/utils/BlockRenderer';

// Define the component props interface
interface InlineEditFormProps {
  block: LayoutBlock;
  onUpdate: (newProps: any) => void;
}

const InlineEditForm = ({ block /*, onUpdate */ }: InlineEditFormProps) => {
  // In a real application, this component would render inputs based on block.type 
  return (
    <div className="block-edit-form">
      <strong>Inline Form:</strong> Editing {block.type} props
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
    <main className="c-page c-page-admin">
      <div className="c-container c-section c-stack">
        <h1 className="type-h1">Edit Page Layout (Mock)</h1>

        {blocks.map((block, index) => (
          <div
            key={block._key ?? `${block.type}-${index}`}
            className="block-edit-wrapper"
          >
            <strong className="type-small type-muted">
              Block {index + 1}: {block.type}
            </strong>

            {/* Render the block itself */}
            <div className="block-preview">
              <BlockRenderer blocks={[block]} />
            </div>

            {/* Inline “editor” stub */}
            <InlineEditForm
              block={block}
              onUpdate={(newProps) => {
                setBlocks((prev) =>
                  prev.map((b, i) =>
                    i === index ? { ...b, props: { ...b.props, ...newProps } } : b,
                  ),
                );
              }}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
