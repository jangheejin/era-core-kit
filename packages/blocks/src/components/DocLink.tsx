import React from 'react';

export function DocLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <a href={href} style={{
      display: 'inline-block',
      padding: '0.5rem 1rem',
      background: '#F3F4F6',
      border: '1px solid #D1D5DB',
      borderRadius: '4px',
      textDecoration: 'none',
      color: '#111'
    }}>
      {children}
    </a>
  );
}
