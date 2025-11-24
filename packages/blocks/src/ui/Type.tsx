// packages/blocks/src/ui/Type.tsx

type Props = { children: React.ReactNode };

export function H1({ children }: Props) {
  return <h1 className="type-h1">{children}</h1>;
}

export function H2({ children }: Props) {
  return <h2 className="type-h2">{children}</h2>;
}

export function H3({ children }: Props) {
  return <h3 className="type-h3">{children}</h3>;
}

export function Body({ children }: Props) {
  return <p className="type-body">{children}</p>;
}

export function Small({ children }: Props) {
  return <p className="type-small">{children}</p>;
}
