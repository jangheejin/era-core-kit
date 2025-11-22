//apps/site/app/page.tsx

// LANDING PAGE

//"use client";
//import React from 'react';
//import dynamic from 'next/dynamic';
//import { homeLayout } from '@/content/home.layout';
import BlockRenderer from '@/utils/BlockRenderer'; 
import { homeLayout } from '@/content/home.layout';
//import { homeLayout, workTextProps, caseGridProps } from '@/content/home.layout';
//import { WorkText, CaseGrid } from '@kit/blocks';
import { ContactForm } from "@/components/sections/ContactForm";

//const Home = () => {
export default function Home() {
  return (
    <main>
      {/* {homeLayout.map((block, index) => ( */}
{/*         // 1. Pass the unique 'key' prop to satisfy React warnings.
        // 2. Pass 'block' and 'index' directly to BlockRenderer. */}
{/*        /*  <BlockRenderer blocks={homeLayout} /> */
/*         <BlockRenderer 
          key={block._key ?? index}
          block={block} 
          index={index} 
        /> */
/*       ))} */ /* */}
      {/* Render the layout ONCE */}
      <BlockRenderer blocks={homeLayout} />

{/* Combined section: WorkText + CaseGrid inside one .c-section */}
{/*       <section className="c-section">
        <div className="c-container c-stack">
          <WorkText {...workTextProps} />
          <CaseGrid {...caseGridProps} />
        </div>
      </section> */}

      {/* Contact section rendered explicitly, not via layout */}
      <ContactForm heading="We’re here to advance your interests" />
    </main>
  );
};