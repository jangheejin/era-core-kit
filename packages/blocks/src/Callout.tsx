export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ borderLeft: '4px solid #4A90E2', paddingLeft: '1em', margin: '1em 0' }}>
      {children}
    </div>
  );
}
