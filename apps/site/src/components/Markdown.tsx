//apps/site/app/src/components/Markdown.tsx

//wrapper to centralize the remapping of raw markdown input into formatted, user-viewable output

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

type Props = {
  children: string;
  className?: string;
};

const mdComponents: Components = {
  // To do: potentially refine this
  h1: (props) => <h2 className="type-h3" {...props} />,
  h2: (props) => <h3 className="type-h3" {...props} />, // makes "## Summary" look like type-h3
  h3: (props) => <h4 className="type-h4" {...props} />,
};

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
      {children}
    </ReactMarkdown>
  );
}

