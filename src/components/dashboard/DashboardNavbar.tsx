'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import UserMenu from '../shared/UserMenu';
import ThemeToggle from '../ui/ThemeToggle';
import { useAuth } from '@/providers/AuthProvider';

interface DashboardNavbarProps {
  onToggleSidebar?: () => void;
}

interface ProximaReserva {
  nombre: string;
  fecha: string;
  hora: string;
}

export default function DashboardNavbar({ onToggleSidebar }: DashboardNavbarProps) {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  // TODO: Integrar con el endpoint cuando esté disponible
  const [proximaReserva, setProximaReserva] = useState<ProximaReserva | null>(null);

  // Detectar modo oscuro
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener('change', handleChange);
    
    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleToggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    
    // Actualizar controlador del sidebar
    const controller = document.getElementById('sidebar-controller');
    if (controller) {
      controller.setAttribute('data-open', newState.toString());
    }
    
    // Llamar a la función proporcionada por el padre si existe
    if (onToggleSidebar) {
      onToggleSidebar();
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 right-0 z-40 transition-all duration-300 ease-in-out" style={{ left: 'var(--sidebar-width)' }}>
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Botón de menú para móvil */}
        <div className="flex items-center lg:hidden">
          <button
            type="button"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mr-3"
            onClick={handleToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Próxima reserva en el centro */}
        <div className="flex-1 flex justify-center">
          {proximaReserva ? (
            <Link href="/dashboard/cliente/reservas" className="group flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 px-4 py-1.5 rounded-full transition-colors">
              <div className="flex items-center space-x-1.5 text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">Próxima reserva:</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">{proximaReserva.nombre}</span>
                <span className="text-sm text-emerald-600 dark:text-emerald-400">{proximaReserva.fecha} • {proximaReserva.hora}</span>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ) : (
            <Link href="/dashboard/cliente/explorar" className="group flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              <span>No tienes reservas programadas</span>
              <span className="text-emerald-600 dark:text-emerald-400">Explorar espacios</span>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
      
      {/* Evento personalizado para controlar la apertura del sidebar */}
      <div id="sidebar-controller" data-open={isSidebarOpen} className="hidden" />
    </nav>
  );
} 