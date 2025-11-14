// packages/blocks/src/ui/ResponsiveImage.tsx
type ResponsiveImageProps = {
    src: string;
    alt: string;
    aspect?: string; // e.g., '4/3', '16/9', etc.
    fill?: boolean;
    style?: React.CSSProperties;
  };
  
  export function ResponsiveImage({
    src,
    alt,
    aspect = '16/9',
    fill = false,
    style = {},
  }: ResponsiveImageProps) {
    const [w, h] = aspect.split('/').map(Number);
    const validW = w || 16; // Default width
    const validH = h || 9;  // Default height
    const paddingBottom = `${(validH / validW) * 100}%`;
  
    if (fill) {
      return (
        <div style={{ position: 'relative', width: '100%', paddingBottom }}>
          <img
            src={src}
            alt={alt}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: style.objectFit || 'cover',
              ...style,
            }}
          />
        </div>
      );
    }
  
    return (
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: 'auto',
          objectFit: style.objectFit || 'cover',
          ...style,
        }}
      />
    );
  }
  