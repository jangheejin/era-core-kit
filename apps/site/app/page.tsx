//apps/site/app/page.tsx

//'use client';

import React from 'react';
import { homeLayout } from '@/content/home.layout';
//import { homeLayout } from '../src/content/home.layout';
import BlockRenderer from '@/utils/BlockRenderer'; 
import { PageRenderer } from '@/components/PageRenderer'; // Import the new client component

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

export default Home;