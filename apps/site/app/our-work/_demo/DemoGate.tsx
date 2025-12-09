//apps/site/app/our-work/_demo/DemoGate.tsx
"use client";

import { useEffect } from "react";
import { AdminCaseStudyProvider } from "../../admin/AdminCaseStudyStore";
import { DemoOurWorkIndex } from "./DemoOurWorkIndex"
import { DemoOurWorkDetail } from "./DemoOurWorkDetail";

export function DemoGate({ enabled, slug }: { enabled: boolean; slug?: string }) {
  useEffect(() => {
    if (!enabled) return;
    document.documentElement.setAttribute("data-cms-demo", "1");
    return () => document.documentElement.removeAttribute("data-cms-demo");
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div data-cms-demo-only="1" className="cms-demo-shell">
      <div className="cms-demo-banner">
        Demo preview: showing drafts/edits stored in this browser (localStorage).
      </div>

      <AdminCaseStudyProvider>
        {slug ? <DemoOurWorkDetail slug={slug} /> : <DemoOurWorkIndex />}
      </AdminCaseStudyProvider>
    </div>
  );
}
