//packages/blocks/src/components/WorkWithCaseGrid.tsx
import type { WorkWithCaseGridProps } from '../types';
import { WorkText } from './WorkText';
import { CaseGrid } from './CaseGrid';

export function WorkWithCaseGrid(props: WorkWithCaseGridProps) {
  const { heading, text, layout, items } = props;

  return (
    <section className="c-section">
      <div className="c-container c-stack">
        <WorkText heading={heading} text={text} />
        <CaseGrid layout={layout} items={items} />
      </div>
    </section>
  );
}
