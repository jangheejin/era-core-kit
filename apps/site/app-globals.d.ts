// apps/site/app-globals.d.ts

// This tells TypeScript that the 'next' package exports a type named 'Metadata'.
// This forces the type definition to be available without relying on direct import resolution.
declare module 'next' {
  export type { Metadata };
}