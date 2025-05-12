"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import DashboardContainer from '@/components/dashboard/DashboardContainer';

export default function EspaciosPropietarioPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [espacios, setEspacios] = useState([]);

  useEffect(() => {
    if (user) {
      // Aquí iría la lógica para cargar los espacios del propietario
      // Por ahora solo simulamos una carga
      setTimeout(() => {
        setLoading(false);
        // Datos de ejemplo
        setEspacios([]);
      }, 1000);
    }
  }, [user]);

  return (
    <DashboardContainer
      title="Mis Espacios Deportivos"
      description="Administra tus espacios deportivos y canchas"
      actions={
        <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-sm">
          Crear Nuevo Espacio
        </button>
      }
    >
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : espacios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Aquí se mostrarían los espacios del propietario */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <p className="text-center text-gray-600 dark:text-gray-400">
              Contenido del espacio
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 px-4">
          <svg className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">No tienes espacios deportivos</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Comienza a añadir tus espacios deportivos para que los usuarios puedan reservarlos.
          </p>
          <div className="mt-6">
            <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-sm">
              Crear mi primer espacio
            </button>
          </div>
        </div>
      )}
    </DashboardContainer>
  );
} 