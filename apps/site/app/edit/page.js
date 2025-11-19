//apps/site/app/edit/page.tsx
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import BlockRenderer from '@/utils/BlockRenderer';
const InlineEditForm = ({ block, onUpdate }) => {
    // In a real application, this component would render inputs based on block.type 
    return (_jsxs("div", { className: "block-edit-form", children: [_jsx("strong", { children: "Inline Form:" }), " Editing ", block.type, " Props"] }));
};
const initialData = [
    {
        type: 'Hero',
        props: {
            heading: 'Welcome to the site!',
            subhead: 'Here is where you can edit pages',
            imageUrl: '/hero.jpg',
        },
        _key: 'hero-1',
    },
    {
        type: 'Callout',
        props: {
            content: 'This is a callout.',
        },
        _key: 'callout-1',
    },
];
export default function EditPage() {
    const [blocks, setBlocks] = useState(initialData);
    return (_jsxs("main", { children: [_jsx("h1", { children: "Edit Page Layout" }), blocks.map((block, index) => (_jsxs("div", { className: "block-edit-wrapper", children: [_jsx("strong", { children: block.type }), _jsx("div", { children: _jsx(BlockRenderer, { block: block, index: index }) }), _jsx(InlineEditForm, { block: block, onUpdate: () => { } })] }, block._key ?? `${block.type}-${index}`)))] }));
}
