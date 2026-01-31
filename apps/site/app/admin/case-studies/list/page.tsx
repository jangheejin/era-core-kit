// apps/site/app/admin/case-studies/list/page.tsx
// "database" view of case studies

//server wrapper with Suspense

import { Suspense } from "react";
import ListClient from "./ListClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="c-admin">Loading…</div>}>
      <ListClient />
    </Suspense>
  );
}
