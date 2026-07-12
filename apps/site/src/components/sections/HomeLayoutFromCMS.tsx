// apps/site/src/components/sections/HomeLayoutFromCMS.tsx
"use client";

import { useMemo } from "react";
import BlockRenderer from "@/components/BlockRenderer";
import { ContactForm } from "@/components/sections/ContactForm";
import { buildHomeLayout } from "@/lib/content/homeContent";
import { useAdminHomeContent } from "@/admin/AdminHomeStore";

export default function HomeLayoutFromCMS() {
  const { content } = useAdminHomeContent();
  const blocks = useMemo(() => buildHomeLayout(content), [content]);

  return (
    <main>
      <BlockRenderer blocks={blocks} />
      <ContactForm heading="We're here to advance your interests" />
    </main>
  );
}
