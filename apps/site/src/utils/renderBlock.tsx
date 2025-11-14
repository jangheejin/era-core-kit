// apps/site/src/utils/renderBlock.tsx
import { sectionRegistry } from '@/registry';
import type { LayoutBlock } from '@/types/layout';

export function renderBlock<B extends LayoutBlock>(block: B, index: number) {
  const Component = sectionRegistry[block.type] as React.FC<typeof block.props>;

  if (!Component) {
    console.warn(`Unknown block type: ${block.type}`);
    return null;
  }

  return <Component key={index} {...block.props} />;
}
