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
  
  // Configuración de encabezados de seguridad
  async headers() {
    return [
      {
        // Aplicar estos encabezados a todas las rutas
        source: '/:path*',
        headers: [
          {
            key: 'Server',
            value: 'Classified',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            // Ocultar las tecnologías utilizadas
            key: 'X-Powered-By',
            value: 'Classified',
          }
        ],
      },
    ];
  },
};

export default nextConfig; 