// packages/blocks/src/components/RichTextSection.tsx
import "@styles/rich-section.css";
import type { RichTextSectionProps } from "../types";

function splitParagraphs(body: string) {
  return body
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
}

export function RichTextSection(props: RichTextSectionProps) {
  const { heading, body, subheads, imageUrl } = props;
  const paragraphs = splitParagraphs(body);
  const headings = (subheads ?? []).map((h) => h.trim()).filter(Boolean);

  return (
    <section className="c-section c-section--rich">
      <div className="c-container rich-grid">
        <div className="rich-copy">
          <h2 className="type-h2">{heading}</h2>
          {headings.map((text, index) => (
            <h3 className="type-h3 rich-subhead" key={`${text}-${index}`}>
              {text}
            </h3>
          ))}
          {paragraphs.map((text, index) => (
            <p className="type-body" key={`${text}-${index}`}>
              {text}
            </p>
          ))}
        </div>
        {imageUrl ? (
          <div className="rich-image">
            <img src={imageUrl} alt="" loading="lazy" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
