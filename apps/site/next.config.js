//apps/site/next.config.js
const path = require('path')
const createMDX = require('@next/mdx')

const withMDX = createMDX({
  extension: /\.mdx?$/,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src')
    config.resolve.alias['@kit/blocks'] = path.resolve(__dirname, '../../packages/blocks/dist')
    config.resolve.alias['@kit/schema'] = path.resolve(__dirname, '../../packages/schema/dist')
    config.resolve.alias['@kit/adapters-sanity'] = path.resolve(__dirname, '../../packages/adapters/sanity/dist')
    return config
  }
}

module.exports = withMDX(nextConfig)
