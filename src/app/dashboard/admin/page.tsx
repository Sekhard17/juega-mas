'use client';

import RoleGuard from '@/components/dashboard/shared/RoleGuard';
import DashboardHeader from '@/components/dashboard/shared/DashboardHeader';
import UserSummaryCard from '@/components/dashboard/shared/UserSummaryCard';
import RecentActivityCard from '@/components/dashboard/shared/RecentActivityCard';
import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <DashboardHeader title="Dashboard de Administrador" />

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
                    href="/admin/usuarios"
                    className="block p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-md text-emerald-700 dark:text-emerald-300 font-medium transition-colors"
                  >
                    Gestionar usuarios
                  </Link>
                  <Link 
                    href="/admin/espacios"
                    className="block p-3 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md text-blue-700 dark:text-blue-300 font-medium transition-colors"
                  >
                    Gestionar espacios
                  </Link>
                  <Link 
                    href="/admin/reservas"
                    className="block p-3 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-md text-purple-700 dark:text-purple-300 font-medium transition-colors"
                  >
                    Gestionar reservas
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas del sistema */}
          <div className="mt-8 bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Estadísticas del sistema</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                  <p className="text-sm text-blue-600 dark:text-blue-300">Total de usuarios</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-200">0</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
                  <p className="text-sm text-green-600 dark:text-green-300">Total de espacios</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-200">0</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md">
                  <p className="text-sm text-purple-600 dark:text-purple-300">Reservas totales</p>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-200">0</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md">
                  <p className="text-sm text-amber-600 dark:text-amber-300">Ingresos totales</p>
                  <p className="text-2xl font-bold text-amber-700 dark:text-amber-200">$0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Usuarios recientes */}
          <div className="mt-8 bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Usuarios recientes</h2>
              <div className="border rounded-md overflow-hidden">
                <div className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                  No hay usuarios recientes para mostrar
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <Link href="/admin/usuarios" className="text-emerald-600 hover:text-emerald-500 font-medium">
                  Ver todos los usuarios
                </Link>
              </div>
            </div>
          </div>

          {/* Actividad del sistema */}
          <div className="mt-8 bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Actividad del sistema</h2>
              <div className="border rounded-md overflow-hidden">
                <div className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                  No hay actividad reciente para mostrar
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </RoleGuard>
  );
} 