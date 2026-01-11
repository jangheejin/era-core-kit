/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Keep this list synced with packages/schema/src/routing.ts (SECTOR_ROUTE_SLUG)
    const sectorSlugs = [
      "public-sector",
      "environment",
      "natural-resources",
      "energy",
      "agriculture",
      "transportation",
      "infrastructure-public-works",
      "appropriations",
      "grant-funding",
      "state-government",
      "local-government",
      "tribal-government",
      "private-sector",
      "government-contracting",
      "nonprofit",
      "emergency-management",
      "education",
      "geospatial",
      "manufacturing",
      "industry",
      "defense",
      "health",
      "fintech",
      "civic-tech",
      "infrastructure",
    ];

    // returning an array here = "afterFiles" rewrites (won't override real routes)
    return sectorSlugs.map((slug) => ({
      source: `/${slug}`,
      destination: `/sectors/${slug}`,
    }));
  },
};

export default nextConfig;
