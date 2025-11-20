//apps/site/app/page.tsx

"use client";
//import React from 'react';
//import dynamic from 'next/dynamic';
import { homeLayout } from '@/content/home.layout';
import BlockRenderer from '@/utils/BlockRenderer'; 

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