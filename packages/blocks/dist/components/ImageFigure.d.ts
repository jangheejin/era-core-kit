import type { ImageFigureProps as BaseImageFigureProps } from '../types';
interface ComponentProps {
    aspect?: string;
    fill?: boolean;
    className?: string;
}
type ImageFigureComponentProps = BaseImageFigureProps & ComponentProps;
export declare function ImageFigure({ src, alt, caption, aspect, fill, style, className, }: ImageFigureComponentProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ImageFigure.d.ts.map