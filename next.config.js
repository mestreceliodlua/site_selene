/** @type {import('next').NextConfig} */
const nextConfig = {
  // Necessário para o build Docker multi-stage com output standalone
  output: 'standalone',
}

module.exports = nextConfig
