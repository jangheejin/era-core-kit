// apps/site/app/ClientWrapper.tsx
'use client';

// Import any client-side context providers, state managers, etc. here

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  // Use client-only hooks or providers here if needed
  return <>{children}</>;
}