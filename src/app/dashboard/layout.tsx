'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Si no está autenticado, redirigir al login
    if (!loading && !isAuthenticated) {
      router.push('/auth/login?redirect=/dashboard');
      return;
    }

    // Si está autenticado y estamos en la ruta /dashboard exactamente (no en un subdirectorio),
    // redirigir al dashboard específico según el rol
    if (
      !loading && 
      isAuthenticated && 
      user && 
      typeof window !== 'undefined' && 
      window.location.pathname === '/dashboard'
    ) {
      switch (user.role) {
        case 'usuario':
          router.push('/dashboard/cliente');
          break;
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
          // Si por alguna razón el rol no está definido, mandamos al dashboard de cliente
          router.push('/dashboard/cliente');
      }
    }
  }, [isAuthenticated, loading, router, user]);

  // Cargar el estado inicial de localStorage una vez al inicio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('sidebarState');
      if (savedState !== null) {
        const isOpen = savedState === 'open';
        setIsSidebarOpen(isOpen);
        
        // Asegurar que el controller tenga el estado correcto
        setTimeout(() => {
          const controller = document.getElementById('sidebar-controller');
          if (controller) {
            controller.setAttribute('data-open', isOpen.toString());
          }
        }, 0);
      }
    }
  }, []);
  
  // Controlador para alternar la barra lateral
  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarState', newState ? 'open' : 'closed');
    }
  };

  useEffect(() => {
    // Crear un elemento para controlar el estado del sidebar que pueda ser observado
    if (typeof window !== 'undefined' && !document.getElementById('sidebar-controller')) {
      const controller = document.createElement('div');
      controller.id = 'sidebar-controller';
      controller.setAttribute('data-open', isSidebarOpen.toString());
      controller.style.display = 'none';
      document.body.appendChild(controller);
    } else if (typeof window !== 'undefined') {
      const controller = document.getElementById('sidebar-controller');
      if (controller) {
        controller.setAttribute('data-open', isSidebarOpen.toString());
      }
    }
  }, [isSidebarOpen]);

  // Observar el elemento del controlador para mantener el estado sincronizado
  useEffect(() => {
    const sidebarController = document.getElementById('sidebar-controller');
    
    if (sidebarController) {
      const handleSidebarChange = () => {
        const isOpen = sidebarController.getAttribute('data-open') === 'true';
        setIsSidebarOpen(isOpen);
      };
      
      // Observar cambios en el atributo data-open
      const observer = new MutationObserver(handleSidebarChange);
      observer.observe(sidebarController, { attributes: true });
      
      // Cargar estado inicial desde localStorage
      const savedState = localStorage.getItem('sidebarState');
      if (savedState !== null) {
        setIsSidebarOpen(savedState === 'open');
      }
      
      return () => observer.disconnect();
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Cargando...</p>
        </div>
      </div>
    );
  }

  // Solo renderizar la estructura completa si está autenticado
  return isAuthenticated ? (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar initialIsOpen={isSidebarOpen} />
      <div className="flex-1 transition-all duration-300 ease-in-out" style={{ marginLeft: 'var(--sidebar-width)' }}>
        <DashboardNavbar onToggleSidebar={toggleSidebar} />
        <main className="pt-16">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  ) : null;
} 