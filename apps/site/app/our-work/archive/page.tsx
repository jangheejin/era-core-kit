// apps/site/app/our-work/archive/page.tsx

import { OurWorkDataBridge } from "../OurWorkDataBridge";

export default function OurWorkArchivePage() {
  return (
    <div data-cms-ssr="1">
      <OurWorkDataBridge basePath="/our-work" />
    </div>
  );
}
