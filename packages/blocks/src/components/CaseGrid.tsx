// packages/blocks/src/components/CaseGrid.tsx
// REACT COMPONENT FOR CASEGRID
//'use client';
import "@styles/casegrid.css";
import { ImageFigure } from "./ImageFigure";
import type { CaseGridProps } from "../types";
//import { ClientAnimations } from './ClientAnimations';

function normalizeLayout(layout?: string) {
  // Support existing content/layout values
  if (!layout) return "layout-3";
  //if (!layout) return "layout-2x2";
  if (layout === "4col") return "layout-4";
  if (layout === "3col") return "layout-3";
  if (layout === "2col") return "layout-2";
  if (layout === "2x2") return "layout-2x2";

  // Also allow passing the real CSS class names directly
  return layout;
}

function pickSingleSector(item: any) {
  // Strictly pick ONE label
  if (item.primarySectorReadable) return item.primarySectorReadable;
  if (item.primarySector) return String(item.primarySector);

  if (Array.isArray(item.sectors) && item.sectors.length) return String(item.sectors[0]);

  // Back-compat with old shape
  if (item.sector) return String(item.sector);

  // Last resort: if someone only provided a readable string, take the first chunk
  if (typeof item.sectorsReadable === "string" && item.sectorsReadable.trim()) {
    return item.sectorsReadable.split("·")[0].split(",")[0].trim();
  }

  return "";
}

export function CaseGrid({ items, layout }: CaseGridProps) {
  const layoutClass = normalizeLayout(layout);
  const SECTOR_SEPARATOR = ", "; // or " · "
  return (
    <section id="case-studies">
      {/* <section className="c-section" id="case-studies"> */}
      {/* <div className="c-container"> */}
      {/* <h2 className="type-h2">Our Work</h2> */}
      <div className={`casegrid ${layoutClass}`} id="case-studies">
      {/* <div className={`casegrid ${layout ?? "layout-2x2"}`} id="case-studies"> */}
      {/* <div className="casegrid layout-2x2" id="case-studies"> */}
        {items.map((item) => (
          <a
            key={item.slug}
            href={`/case-studies/${item.slug}`}
            className="case-card"
          >
            <div className="case-card__image">
              <ImageFigure src={item.imageUrl} alt={item.title ?? ""} aspect="4/3" />
              {/* <ImageFigure src={item.imageUrl} alt={item.client ?? ""} aspect="4/3" /> */}
              {/* <ImageFigure src={item.imageUrl} alt={item.client} aspect="4/3" /> */}
            </div>

            <div className="case-card__body">
              {/* <h3 className="card-h3">
                {item.sectorsReadable ?? item.sectors?.join(SECTOR_SEPARATOR) ?? ""}
              </h3> */}
              <h3 className="card-h3">{pickSingleSector(item)}</h3>
              <h2 className="card-h2">{item.client}</h2>
              {item.summary && (
                <p className="type-body case-card__summary">{item.summary}</p>
              )}
            </div>
          </a>
        ))}
      </div>
      {/* </div> */}
    </section>
  );
}
//note: used to be item.sectors