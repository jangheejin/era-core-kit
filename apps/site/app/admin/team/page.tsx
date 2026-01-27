// apps/site/app/admin/team/page.tsx

import { Suspense } from "react";
import { AdminTeamClient } from "./AdminTeamClient";

export default function AdminTeamPage() {
  return (
    <Suspense fallback={<div className="c-section">Loading team editor…</div>}>
      <AdminTeamClient />
    </Suspense>
  );
}
