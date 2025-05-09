'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import ProfileInfo from './components/ProfileInfo';
import SecuritySettings from './components/SecuritySettings';
import NotificationSettings from './components/NotificationSettings';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// Tipos de pestañas disponibles
type TabType = 'info' | 'security' | 'notifications';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, refreshUserData } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si el usuario está autenticado
  useEffect(() => {
    if (!loading) {
      setIsLoading(false);
      if (!user) {
        router.push('/auth/login?redirect=/perfil');
      }
    }
  }, [user, loading, router]);

  // Manejador para actualizar información del usuario
  const handleProfileUpdate = async () => {
    // Refrescar datos del usuario
    await refreshUserData();
    toast.success('Perfil actualizado correctamente');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Evitar renderizar si no hay usuario (se redirigirá en el useEffect)
  }

  return (
    <div className="pt-4 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-5xl mx-auto"
        >
          {/* Encabezado con posición más alta y más compacto */}
          <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">
                Mi Perfil
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Administra tu información personal y preferencias
              </p>
            </div>
            
            {/* Acciones rápidas en línea con el título en pantallas grandes */}
            <div className="flex space-x-2 mt-2 sm:mt-0">
              <button className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors duration-200">
                Mis Reservas
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-600 dark:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors duration-200">
                Mis Favoritos
              </button>
            </div>
          </div>

          {/* Contenedor principal más compacto */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            {/* Tabs de navegación mejorados y más compactos */}
            <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`py-2.5 px-4 text-center border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === 'info'
                      ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white/50 dark:bg-gray-800/50'
                      : 'border-transparent text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 hover:bg-white/30 dark:hover:bg-gray-800/30'
                  }`}
                >
                  <div className="flex items-center space-x-1.5">
                    <svg
                      className="h-4 w-4"
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
                  className={`py-2.5 px-4 text-center border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === 'security'
                      ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white/50 dark:bg-gray-800/50'
                      : 'border-transparent text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 hover:bg-white/30 dark:hover:bg-gray-800/30'
                  }`}
                >
                  <div className="flex items-center space-x-1.5">
                    <svg
                      className="h-4 w-4"
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
                  className={`py-2.5 px-4 text-center border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === 'notifications'
                      ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white/50 dark:bg-gray-800/50'
                      : 'border-transparent text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 hover:bg-white/30 dark:hover:bg-gray-800/30'
                  }`}
                >
                  <div className="flex items-center space-x-1.5">
                    <svg
                      className="h-4 w-4"
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
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="p-4"
            >
              {activeTab === 'info' && (
                <ProfileInfo user={user} onProfileUpdated={handleProfileUpdate} />
              )}
              {activeTab === 'security' && (
                <SecuritySettings user={user} />
              )}
              {activeTab === 'notifications' && (
                <NotificationSettings user={user} onSettingsUpdated={handleProfileUpdate} />
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 