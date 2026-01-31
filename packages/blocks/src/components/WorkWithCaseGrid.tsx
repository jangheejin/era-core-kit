//packages/blocks/src/components/WorkWithCaseGrid.tsx
import type { WorkWithCaseGridProps } from "../types";
import { WorkText } from "./WorkText";
import { CaseGrid } from "./CaseGrid";

export function WorkWithCaseGrid(props: WorkWithCaseGridProps) {
  const { heading, text, text2, gridHeading, layout, items } = props;
  const showWorkText = Boolean(heading || text || text2);

  return (
    <section className="c-section">
      <div className="c-container c-stack">
        {showWorkText ? (
          <WorkText heading={heading} text={text} text2={text2} />
        ) : null}

        {gridHeading ? <h3 className="type-h3">{gridHeading}</h3> : null}
        <CaseGrid layout={layout} items={items} />
      </div>
    </section>
  );
}
