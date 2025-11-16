"use client";
import React from "react";
import { homeLayout } from "../src/content/home.layout";
import { renderBlock } from "@/utils/renderBlock";
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
  return (
    <main>
      {homeLayout.map((block, index) => (
        <React.Fragment key={block._key ?? `${block.type}-${index}`}>
          {renderBlock(block, index)}
        </React.Fragment>
      ))}
    </main>
  );
}
