/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'target',
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
      }, {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
}

module.exports = nextConfig
