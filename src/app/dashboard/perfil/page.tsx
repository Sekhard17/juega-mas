'use client';

import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import ProfileInfo from '@/app/perfil/components/ProfileInfo';
import SecuritySettings from '@/app/perfil/components/SecuritySettings';
import NotificationSettings from '@/app/perfil/components/NotificationSettings';
import { toast } from 'sonner';

// Tipos de pestañas disponibles
type TabType = 'info' | 'security' | 'notifications';

export default function DashboardProfilePage() {
  const { user, refreshUserData } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('info');

  // Manejador para actualizar información del usuario
  const handleProfileUpdate = async () => {
    // Refrescar datos del usuario
    await refreshUserData();
    toast.success('Perfil actualizado correctamente');
  };

  if (!user) {
    return (
      <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
        <p className="text-lg text-gray-700 dark:text-gray-300">Cargando datos de perfil...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="text-center sm:text-left mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Mi Perfil
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Administra tu información personal y preferencias
        </p>
      </div>

      {/* Contenedor principal */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        {/* Tabs de navegación */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex justify-center sm:justify-start">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm sm:text-base transition-all duration-200 ${
                activeTab === 'info'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="hidden sm:inline">Información Personal</span>
                <span className="inline sm:hidden">Perfil</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm sm:text-base transition-all duration-200 ${
                activeTab === 'security'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span className="hidden sm:inline">Seguridad</span>
                <span className="inline sm:hidden">Seguridad</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm sm:text-base transition-all duration-200 ${
                activeTab === 'notifications'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="hidden sm:inline">Notificaciones</span>
                <span className="inline sm:hidden">Alertas</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Contenido de la pestaña activa */}
        <div className="p-6 sm:p-8">
          {activeTab === 'info' && (
            <ProfileInfo user={user} onProfileUpdated={handleProfileUpdate} />
          )}
          {activeTab === 'security' && (
            <SecuritySettings user={user} />
          )}
          {activeTab === 'notifications' && (
            <NotificationSettings user={user} onSettingsUpdated={handleProfileUpdate} />
          )}
        </div>
      </div>
    </div>
  );
} 