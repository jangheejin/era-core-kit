import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function ImageFigure({ src, alt, caption, aspect = '16/9', fill = false, style = {}, }) {
    const [w, h] = aspect.split('/').map(Number);
    const validW = w || 16;
    const validH = h || 9;
    const paddingBottom = `${(validH / validW) * 100}%`;
    const image = fill ? (_jsx("div", { style: { position: 'relative', width: '100%', paddingBottom }, children: _jsx("img", { src: src, alt: alt, style: {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: style.objectFit || 'cover',
                ...style,
            } }) })) : (_jsx("img", { src: src, alt: alt, style: {
            width: '100%',
            height: 'auto',
            objectFit: style.objectFit || 'cover',
            ...style,
        } }));
    return caption ? (_jsxs("figure", { className: "imagefigure", children: [image, _jsx("figcaption", { children: caption })] })) : (image);
}
