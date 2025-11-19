import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function ImageFigure({ src, alt, caption, aspect = '16/9', fill = false, style = {}, className = '', }) {
    const [w, h] = aspect.split('/').map(Number);
    const validW = w || 16;
    const validH = h || 9;
    // CALCULATED STYLE: This is the ONLY style that must remain inline. 
    // It provides the aspect ratio and must be dynamically calculated at runtime.
    const dynamicWrapperStyle = {
        paddingBottom: `${(validH / validW) * 100}%`
    };
    //const paddingBottom = `${(validH / validW) * 100}%`;
    const image = fill ? (
    // Semantic class for the wrapper (sets structural CSS: relative, width: 100%)
    // Later the wrapper will use Tailwind classes for position and size, plus the dynamic style object
    _jsx("div", { className: "ImageFigure__fill-container", style: dynamicWrapperStyle, children: _jsx("img", { src: src, alt: alt, 
            // Semantic class for the image (sets structural CSS: absolute, inset-0, object-cover)
            // Tailwind class will go here later
            className: "ImageFigure__fill-image", style: style }) })) : (_jsx("img", { src: src, alt: alt, 
        // Semantic class for the standard image (sets structural CSS: w-full, object-cover)
        // Tailwind class will go here later
        className: "ImageFigure__standard-image", style: style }));
    return caption ? (
    // Apply external className to the figure element
    _jsxs("figure", { className: `ImageFigure ${className}`, children: [image, _jsx("figcaption", { children: caption })] })) : (
    // Apply external className to the wrapper div
    _jsx("div", { className: `ImageFigure ${className}`, children: image }));
}
