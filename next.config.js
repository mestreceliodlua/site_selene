/** @type {import('next').NextConfig} */
const nextConfig = {
  // Necessário para o build Docker multi-stage com output standalone
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'fonts.googleapis.com' },
      { protocol: 'https', hostname: 'fonts.gstatic.com' },
    ],
  },
}

module.exports = nextConfig
