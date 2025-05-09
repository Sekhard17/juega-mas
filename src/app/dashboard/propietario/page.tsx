'use client';

import RoleGuard from '@/components/dashboard/shared/RoleGuard';
import DashboardHeader from '@/components/dashboard/shared/DashboardHeader';
import UserSummaryCard from '@/components/dashboard/shared/UserSummaryCard';
import RecentActivityCard from '@/components/dashboard/shared/RecentActivityCard';
import Link from 'next/link';

export default function PropietarioDashboardPage() {
  return (
    <RoleGuard allowedRoles={['propietario', 'admin']}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <DashboardHeader title="Dashboard de Propietario" />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Resumen */}
            <UserSummaryCard />

            {/* Actividad reciente */}
            <RecentActivityCard />

            {/* Acciones rápidas */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Acciones rápidas</h2>
                <div className="space-y-4">
                  <Link 
                    href="/espacios/mis-espacios"
                    className="block p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-md text-emerald-700 dark:text-emerald-300 font-medium transition-colors"
                  >
                    Mis espacios
                  </Link>
                  <Link 
                    href="/espacios/crear"
                    className="block p-3 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md text-blue-700 dark:text-blue-300 font-medium transition-colors"
                  >
                    Crear nuevo espacio
                  </Link>
                  <Link 
                    href="/perfil"
                    className="block p-3 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-md text-purple-700 dark:text-purple-300 font-medium transition-colors"
                  >
                    Editar perfil
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas de espacios */}
          <div className="mt-8 bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Estadísticas de espacios</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                  <p className="text-sm text-blue-600 dark:text-blue-300">Total de espacios</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-200">0</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
                  <p className="text-sm text-green-600 dark:text-green-300">Reservas activas</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-200">0</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md">
                  <p className="text-sm text-purple-600 dark:text-purple-300">Ingresos totales</p>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-200">$0</p>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <Link href="/espacios/crear" className="text-emerald-600 hover:text-emerald-500 font-medium">
                  Añadir un nuevo espacio
                </Link>
              </div>
            </div>
          </div>

          {/* Reservas pendientes */}
          <div className="mt-8 bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Reservas pendientes</h2>
              <div className="border rounded-md overflow-hidden">
                <div className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                  No tienes reservas pendientes
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </RoleGuard>
  );
} 