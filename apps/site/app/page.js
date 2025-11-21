import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
//apps/site/app/page.tsx
//"use client";
//import React from 'react';
//import dynamic from 'next/dynamic';
import { homeLayout } from '@/content/home.layout';
import BlockRenderer from '@/utils/BlockRenderer';
import { ContactForm } from "@/components/sections/ContactForm";
//const Home = () => {
export default function Page() {
    return (_jsxs("main", { children: [homeLayout.map((block, index) => (
            // 1. Pass the unique 'key' prop to satisfy React warnings.
            // 2. Pass 'block' and 'index' directly to BlockRenderer.
            _jsx(BlockRenderer, { block: block, index: index }, block._key ?? index))), _jsx(ContactForm, { heading: "We\u2019re here to advance your interests" })] }));
}
;
