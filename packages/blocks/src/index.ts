// packages/blocks/src/index.ts

// Re-export layout components for use in apps
// This is the one typescript actually sees

export * from './components';
export * from './registry';
/*export * from './types';*/
export type { LayoutBlock, BlockComponentProps, GenericBlock } from './types';
export { Callout } from './components/Callout';