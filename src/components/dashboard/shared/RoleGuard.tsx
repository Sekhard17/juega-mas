'use client';

import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types/user';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  redirectTo?: string;
  useUnauthorizedPage?: boolean;
}

export default function RoleGuard({ 
  allowedRoles, 
  children, 
  redirectTo = '/inicio',
  useUnauthorizedPage = false
}: RoleGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Función para verificar si el usuario tiene acceso según su rol
  const hasAccess = (userRole: UserRole, allowedRoles: UserRole[]): boolean => {
    // Tratar 'usuario' como equivalente a 'cliente' (para compatibilidad con código antiguo)
    if (userRole === 'usuario' && allowedRoles.includes('cliente')) {
      return true;
    }
    return allowedRoles.includes(userRole);
  };

  useEffect(() => {
    // Si ya ha cargado el usuario, no está autenticado o no tiene un rol permitido
    if (!loading && (!user || !hasAccess(user.role, allowedRoles))) {
      if (user) {
        // Si se ha indicado que use la página de unauthorized, redirigir ahí
        if (useUnauthorizedPage) {
          router.push('/unauthorized');
          return;
        }
        
        // Si el usuario está autenticado pero no tiene el rol adecuado,
        // lo redirigimos a su dashboard correspondiente
        switch (user.role) {
          case 'usuario':
          case 'cliente':
            router.push('/dashboard/cliente');
            break;
          case 'propietario':
            router.push('/dashboard/propietario');
            break;
          case 'admin':
            router.push('/dashboard/admin');
            break;
          default:
            router.push(redirectTo);
        }
      } else {
        // Si no está autenticado, redirigir a la página de unauthorized o login
        router.push(useUnauthorizedPage ? '/unauthorized' : redirectTo);
      }
    }
  }, [user, loading, allowedRoles, redirectTo, router, useUnauthorizedPage]);

  // Mientras carga o si no tiene el rol adecuado, muestra pantalla de carga
  if (loading || !user || !hasAccess(user.role, allowedRoles)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Si tiene el rol adecuado, muestra el contenido
  return <>{children}</>;
} 