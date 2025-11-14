import React from 'react';

export function OutcomeList({ outcomes }: { outcomes: string[] }) {
  return (
    <ul style={{ paddingLeft: '1.5rem' }}>
      {outcomes.map((outcome, i) => (
        <li key={i}>{outcome}</li>
      ))}
    </ul>
  );
}
