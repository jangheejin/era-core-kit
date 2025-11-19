//apps/site/app/page.tsx
'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { homeLayout } from '@/content/home.layout';
//import { homeLayout } from '../src/content/home.layout';
import BlockRenderer from '@/utils/BlockRenderer';
const Home = () => {
    return (_jsx("main", { children: homeLayout.map((block, index) => (
        // 1. Pass the unique 'key' prop to satisfy React warnings.
        // 2. Pass 'block' and 'index' directly to BlockRenderer.
        _jsx(BlockRenderer, { block: block, index: index }, block._key ?? index))) }));
};
