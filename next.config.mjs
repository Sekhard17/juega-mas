/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  // Configuración para Next.js 15
  compiler: {
    // Eliminar console.logs en producción
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig; 