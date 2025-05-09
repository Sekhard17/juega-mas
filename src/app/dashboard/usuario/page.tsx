'use client';

import RoleGuard from '@/components/dashboard/shared/RoleGuard';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { useEffect } from 'react';

export default function UsuarioDashboardPage() {
  const { user } = useAuth();

  // Actualizar el título de forma dinámica en el cliente
  useEffect(() => {
    document.title = 'Dashboard de Usuario | JuegaMás';
  }, []);

  return (
    <RoleGuard allowedRoles={['usuario', 'admin', 'cliente']}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Resumen del usuario */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Resumen</h2>
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Usuario:</span>
                <span className="font-medium text-gray-900 dark:text-white">{user?.nombre || 'Usuario'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Email:</span>
                <span className="font-medium text-gray-900 dark:text-white">{user?.email || 'ejemplo@correo.com'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Reservas totales:</span>
                <span className="font-medium text-gray-900 dark:text-white">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Fecha de registro:</span>
                <span className="font-medium text-gray-900 dark:text-white">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actividad reciente */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Actividad reciente</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-center py-10 text-gray-500 dark:text-gray-400">
                No hay actividad reciente
              </div>
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Acciones rápidas</h2>
            <div className="space-y-4">
              <Link 
                href="/dashboard/usuario/reservas"
                className="block p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-md text-emerald-700 dark:text-emerald-300 font-medium transition-colors"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Mis reservas
                </div>
              </Link>
              <Link 
                href="/perfil"
                className="block p-3 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md text-blue-700 dark:text-blue-300 font-medium transition-colors"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Editar perfil
                </div>
              </Link>
              <Link 
                href="/dashboard/usuario/favoritos"
                className="block p-3 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-md text-purple-700 dark:text-purple-300 font-medium transition-colors"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Favoritos
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Reservas próximas */}
      <DashboardContainer 
        title="Reservas próximas" 
        description="Aquí encontrarás tus próximas reservas"
        actions={
          <Link 
            href="/inicio" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Reservar espacio
          </Link>
        }
      >
        <div className="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400">
          <svg className="w-12 h-12 mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-center">No tienes reservas próximas</p>
          <p className="text-center text-sm mt-2">Explora los espacios disponibles y realiza tu primera reserva</p>
        </div>
      </DashboardContainer>

      {/* Espacios populares */}
      <div className="mt-6">
        <DashboardContainer 
          title="Espacios populares" 
          description="Descubre los espacios más reservados"
        >
          <div className="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400">
            <svg className="w-12 h-12 mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-center">Cargando espacios populares...</p>
            <p className="text-center text-sm mt-2">Estamos preparando recomendaciones para ti</p>
          </div>
        </DashboardContainer>
      </div>
    </RoleGuard>
  );
} 