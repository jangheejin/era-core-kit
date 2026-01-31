// packages/blocks/src/components/WorkText.tsx
// REACT COMPONENT FOR WORKTEXT
//'use client';

//import { ImageFigure } from './ImageFigure';
import type { WorkTextProps } from "../types";
import { ClientAnimations } from "./ClientAnimations";

export function WorkText({ heading, text, text2 }: WorkTextProps) {
  return (
    <section className="temp" id="work">
      {/* <div className="c-container"> */}
      <h2 className="type-h2">{heading}</h2>
      <ClientAnimations />
      {text ? <p className="type-body">{text}</p> : null}
      {text2 ? <p className="type-body">{text2}</p> : null}
      {/* </div> */}
    </section>
  );
}
