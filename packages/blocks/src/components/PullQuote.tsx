import React from 'react';

export function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote style={{
      fontSize: '1.5rem',
      fontStyle: 'italic',
      margin: '2rem 0',
      paddingLeft: '1rem',
      borderLeft: '3px solid #ccc'
    }}>
      {children}
    </blockquote>
  );
}
