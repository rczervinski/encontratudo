/********************
 * Next.js Config   *
 ********************/
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' }
    ]
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000'
  }
}

module.exports = nextConfig
