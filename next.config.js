/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['edumy.s3.amazonaws.com'],
  },
}

module.exports = nextConfig
