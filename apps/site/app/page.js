'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { homeLayout } from '../src/content/home.layout';
import { renderBlock } from '@/utils/renderBlock';
/*
export default function Home() {
  return (
    <main>
      {homeLayout.map((block, index) => renderBlock(block, index))}
    </main>
  );
}*/
/*
export default function Home() {
  return <main>
    {homeLayout.map((block, index) => (
    // The key must be on the direct child of the map.
      <React.Fragment key={index}>
        {renderBlock(block, index)}
      </React.Fragment>
    ))}
  </main>;
}*/
export default function Home() {
    return _jsx("main", { children: homeLayout.map((block, index) => (_jsx(React.Fragment, { children: renderBlock(block, index) }, block._key ?? `${block.type}-${index}`))) });
}
