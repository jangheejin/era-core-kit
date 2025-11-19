//apps/site/next.config.js
const path = require('path');

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
});

/* @type {import('next').NextConfig} */
const nextConfig = {
  //Next.js app must be told which local packages to resolve and transpile
  transpilePackages: [
    //INCLUDE ALL LOCAL PACKAGES USED BY THIS APP
    "@kit/cms-contract",
    "@kit/adapters-sanity",
    "@kit/blocks",
    "@kit/schema",
    "@kit/search",
  ],
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
/*  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    
    config.resolve.alias['@kit/blocks'] = path.resolve(__dirname, '../../packages/blocks/dist');
    config.resolve.alias['@kit/schema'] = path.resolve(__dirname, '../../packages/schema/dist');
    config.resolve.alias['@kit/adapters-sanity'] = path.resolve(__dirname, '../../packages/adapters/sanity/dist');

    return config;
  }*/
};

module.exports = withMDX(nextConfig);
