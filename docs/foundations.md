# Foundations: Layout + Devices + Tokens (RESPONSIVE)

## Max content width
- 72rem (~1152px): for content sections
- Full-bleed hero allowed

## Responsive strategy
- Fluid typography (no media query scaling)
- Container queries inside components, not global breakpoints
- Only 1–2 escape hatch media queries globally

## Grid rhythm
- CSS logical spacing tokens (`--space-*`)
- No hard-coded margins/paddings

## Image aspect ratios
- Cards: 16:9
- Team: 1:1
- Logos: height-constrained (40–60px), width auto

## Core layout primitives
- Container: horizontal padding
- Section: vertical rhythm
- Stack: vertical flow
- Grid: responsive auto-fit minmax

