import React from 'react';

export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      borderLeft: '4px solid #60A5FA',
      paddingLeft: '1rem',
      background: '#E0F2FE',
      color: '#1E3A8A',
    }}>
      {children}
    </div>
  );
}
