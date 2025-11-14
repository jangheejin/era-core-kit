'use client';

import { homeLayout } from '@/content/home.layout';
import { renderBlock } from '@/utils/renderBlock';
/*
export default function Home() {
  return (
    <main>
      {homeLayout.map((block, index) => renderBlock(block, index))}
    </main>
  );
}*/
export default function Home() {
  return <main>{homeLayout.map(renderBlock)}</main>;
}