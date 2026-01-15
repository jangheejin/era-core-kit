// apps/site/app/our-work/page.tsx

// Server wrapper: the actual data for the demo site lives in the browser (AdminCaseStudyStore).
// This keeps the route stable while letting the client-side store drive the UI.

import OurWorkPageClient from "./OurWorkPageClient";

export default function OurWorkPage() {
  return <OurWorkPageClient />;
}
