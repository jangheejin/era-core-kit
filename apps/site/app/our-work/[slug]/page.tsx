// apps/site/app/our-work/[slug]/page.tsx

/* import Link from "next/link";
import { getPublicCaseStudyBySlug } from "@/features/caseStudies/publicRepo.server"; */
//import { DemoGate } from "../_demo/DemoGate";
import OurWorkDetailClient from "./OurWorkDetailClient";

export default function OurWorkDetailPage({ params }: { params: { slug: string } }) {
  return <OurWorkDetailClient slug={params.slug} />;
}
