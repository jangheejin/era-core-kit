Local dev: pnpm run dev
Local CI build: pnpm -w run build:site
Deploy build (Vercel): pnpm -w run build:site
Clean tiers:
pnpm run clean
pnpm run clean:caches
pnpm run deepclean
pnpm run nukeclean
