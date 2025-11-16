//packages/blocks/src/components/OutcomeList.tsx
import React from "react";
import type { OutcomeListProps } from "../types";

export function OutcomeList({ outcomes }: OutcomeListProps) {
  return (
    <ul className="outcomeslist">
      {outcomes.map((outcome, i) => (
        <li className="outcome" key={i}>
          {outcome}
        </li>
      ))}
    </ul>
  );
}
