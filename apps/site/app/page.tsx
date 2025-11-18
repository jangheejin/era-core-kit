'use client';
import React from 'react';
import { homeLayout } from '@/content/home.layout';
//import { homeLayout } from '../src/content/home.layout';
import BlockRenderer from '@/utils/BlockRenderer'; 
//import { renderBlock } from '@/utils/renderBlock';
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

const Home = () => {
  return (
    <main>
      {homeLayout.map((block, index) => (
        // 1. Pass the unique 'key' prop to satisfy React warnings.
        // 2. Pass 'block' and 'index' directly to BlockRenderer.
        <BlockRenderer 
          key={block._key ?? index}
          block={block} 
          index={index} 
        />
      ))}
    </main>
  );
};