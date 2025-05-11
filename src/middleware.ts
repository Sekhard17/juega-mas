import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/jwt';

// Rutas públicas (no requieren autenticación)
const publicRoutes = [
  '/',
  '/inicio',
  '/main/inicio',
  '/main/*',
  '/auth/login',
  '/auth/register',
  '/api/auth/login',
  '/api/auth/register',
  '/unauthorized',
  '/not-found',
  '/forbidden',
  '/contacto',
];

// Verifica si una ruta es pública
const isPublicRoute = (route: string): boolean => {
  return publicRoutes.some(publicRoute => {
    if (publicRoute.endsWith('*')) {
      const prefix = publicRoute.slice(0, -1);
      return route.startsWith(prefix);
    }
    return route === publicRoute;
  });
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Rutas API que no necesitan verificación adicional
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/static') || 
      pathname.startsWith('/images') || 
      pathname.includes('.') || 
      isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Obtener cookie de autenticación
  const authToken = req.cookies.get('authToken')?.value;

  // Si no hay token y es una ruta protegida, redirigir al unauthorized
  if (!authToken) {
    // Para rutas API, devolver 401
    if (pathname.startsWith('/api/')) {
      return new NextResponse(
        JSON.stringify({ message: 'No autorizado. Inicia sesión para continuar.' }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Para rutas de la aplicación, redirigir a unauthorized
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  try {
    // Verificar token (ahora es asíncrono)
    const payload = await verifyToken(authToken);
    
    // Si el token no es válido, redirigir al unauthorized
    if (!payload) {
      if (pathname.startsWith('/api/')) {
        return new NextResponse(
          JSON.stringify({ message: 'Sesión expirada o inválida.' }), 
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // Si es válido, agregar información del usuario al request
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', payload.userId.toString());
    requestHeaders.set('x-user-email', payload.email);
    requestHeaders.set('x-user-role', payload.role);

    // Verificar permisos para rutas específicas
    if (pathname.startsWith('/api/admin') && payload.role !== 'admin') {
      return new NextResponse(
        JSON.stringify({ message: 'No tienes permiso para acceder a esta ruta' }), 
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (pathname.startsWith('/dashboard/admin') && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/forbidden', req.url));
    }
    
    if (pathname.startsWith('/dashboard/propietario') && 
        payload.role !== 'propietario' && 
        payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/forbidden', req.url));
    }

    // Continuar con la solicitud
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error('Error en middleware:', error);
    // En caso de error, redirigir al unauthorized
    if (pathname.startsWith('/api/')) {
      return new NextResponse(
        JSON.stringify({ message: 'Error de autenticación' }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }
}

export const config = {
  matcher: [
    /*
     * Matcher permite configurar para qué rutas se ejecuta este middleware
     * Esto excluye archivos estáticos, rutas de API y archivos específicos como robots.txt
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
    '/api/:path*',
  ],
}; 