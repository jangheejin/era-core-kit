// apps/site/app/demo/page.tsx
/*import { cms } from '@/lib/cms';
import { renderBlock } from '@/utils/renderBlock';

export default async function DemoPage() {
  const data = cms.get("demo-case-study");

  return (
    <main>
      <h1>{data.title}</h1>
      {data.blocks.map((block, i) => (
        <div key={i}>{renderBlock(block)}</div>
      ))}
    </main>
  );
}*/
import React from 'react';

export default function DemoPage() {
  return (
    <div>
      <h1>Demo Page</h1>
      {/* Content for the demo route goes here */}
    </div>
  );
}