'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirectPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Redirigir al dashboard específico según el rol
  useEffect(() => {
    // Evitar múltiples redirecciones
    if (isRedirecting) return;
    
    if (!loading && user) {
      setIsRedirecting(true);
      
      // Pequeño timeout para evitar redirecciones demasiado rápidas que puedan causar problemas
      setTimeout(() => {
        switch (user.role) {
          case 'usuario':
          case 'cliente': // Tratar 'cliente' como 'usuario'
            router.push('/dashboard/cliente');
            break;
          case 'propietario':
            router.push('/dashboard/propietario');
            break;
          case 'admin':
            router.push('/dashboard/admin');
            break;
          default:
            router.push('/dashboard/cliente');
        }
      }, 100);
    } else if (!loading && !user) {
      // Si no hay usuario autenticado, redirigir a login
      router.push('/auth/login?redirect=/dashboard');
    }
  }, [user, loading, router, isRedirecting]);

  // Mostrar mensaje de redirección mientras se procesa
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Redirigiendo al dashboard...</p>
      </div>
    </div>
  );
} 