//packages/blocks/src/index.tsx

//This is the gateway users import from.

export { blockRegistry } from './registry';

// --- MDX Block Components (These must be exported for mdx-client.tsx) ---
/*export { Callout } from './components/Callout';
export { PullQuote } from './components/PullQuote';
export { DocLink } from './components/DocLink';       
export { OutcomeList } from './components/OutcomeList'; 
export { ImageFigure } from './components/ImageFigure';
// ADD NEW ONES HERE AS THEY GET CREATED*/
export * from './components';

// --- Types  ---
export * from './types';

// --- Utility Components that *are not part of the main registry* ---
//export { ImageFigure } from './ui/ImageFigure'; 
