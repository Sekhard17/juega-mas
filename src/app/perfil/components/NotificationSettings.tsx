'use client';

import { useState } from 'react';
import { User } from '@/types/user';
import { userController } from '@/controllers/userController';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface NotificationSettingsProps {
  user: User;
  onSettingsUpdated: () => void;
}

export default function NotificationSettings({ user, onSettingsUpdated }: NotificationSettingsProps) {
  const [notificacionesEmail, setNotificacionesEmail] = useState(user.notificaciones_email ?? true);
  const [notificacionesApp, setNotificacionesApp] = useState(user.notificaciones_app ?? true);
  const [notificacionesPush, setNotificacionesPush] = useState(false);
  const [notificacionesSMS, setNotificacionesSMS] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await userController.updateProfile(user.id, {
        notificaciones_email: notificacionesEmail,
        notificaciones_app: notificacionesApp
      });

      if (result.success) {
        onSettingsUpdated();
        toast.success('Preferencias de notificaciones actualizadas');
      } else {
        toast.error(result.error || 'Error al actualizar las preferencias');
      }
    } catch (error) {
      console.error('Error al actualizar notificaciones:', error);
      toast.error('Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <motion.h2 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 mb-6"
      >
        Notificaciones
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Columna izquierda: Preferencias de notificaciones */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm h-full"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Canales de notificación
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Configura cómo quieres recibir tus notificaciones.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Email</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notificacionesEmail}
                        onChange={(e) => setNotificacionesEmail(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Recibe notificaciones importantes en tu correo electrónico
                  </p>
                </div>

                {/* Aplicación */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Aplicación</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notificacionesApp}
                        onChange={(e) => setNotificacionesApp(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Recibe alertas dentro de la plataforma
                  </p>
                </div>

                {/* Push */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Web Push</span>
                    </div>
                    <div className="relative inline-flex items-center cursor-not-allowed">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notificacionesPush}
                        onChange={(e) => setNotificacionesPush(e.target.checked)}
                        disabled
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Recibe notificaciones en tu navegador
                    </p>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Próximamente</span>
                  </div>
                </div>

                {/* SMS */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">SMS</span>
                    </div>
                    <div className="relative inline-flex items-center cursor-not-allowed">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notificacionesSMS}
                        onChange={(e) => setNotificacionesSMS(e.target.checked)}
                        disabled
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Recibe notificaciones por mensaje de texto
                    </p>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Próximamente</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`h-11 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md hover:translate-y-[-1px]'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Guardar preferencias
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
        
        {/* Columna derecha: Tipos de notificaciones */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm h-full"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
            Tipos de notificaciones
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Configura qué tipos de notificaciones deseas recibir.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
                  <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Confirmaciones de reserva</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Cuando tu reserva sea confirmada</p>
                </div>
              </div>
              <span className="flex items-center justify-center h-6 min-w-10 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30 rounded-full">
                Siempre
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-3">
                <div className="bg-amber-100 dark:bg-amber-900/50 p-2 rounded-full">
                  <svg className="h-5 w-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Recordatorios</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">24 horas antes de tu reserva</p>
                </div>
              </div>
              <span className="flex items-center justify-center h-6 min-w-10 px-2.5 py-1 text-xs font-medium text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/30 rounded-full">
                {notificacionesEmail ? 'Activo' : 'Desactivado'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-full">
                  <svg className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Promociones</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ofertas especiales y descuentos</p>
                </div>
              </div>
              <span className="flex items-center justify-center h-6 min-w-10 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/30 rounded-full">
                {notificacionesEmail ? 'Activo' : 'Desactivado'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-full">
                  <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Mensajes</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Comunicaciones de propietarios</p>
                </div>
              </div>
              <span className="flex items-center justify-center h-6 min-w-10 px-2.5 py-1 text-xs font-medium text-purple-700 bg-purple-100 dark:text-purple-300 dark:bg-purple-900/30 rounded-full">
                {notificacionesApp ? 'Activo' : 'Desactivado'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded-full">
                  <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Cancelaciones</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Notificaciones de cancelación</p>
                </div>
              </div>
              <span className="flex items-center justify-center h-6 min-w-10 px-2.5 py-1 text-xs font-medium text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30 rounded-full">
                Siempre
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 