"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import DashboardContainer from '@/components/dashboard/DashboardContainer';

export default function ReservasPropietarioPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    if (user) {
      // Aquí iría la lógica para cargar las reservas del propietario
      // Por ahora solo simulamos una carga
      setTimeout(() => {
        setLoading(false);
        // Datos de ejemplo
        setReservas([]);
      }, 1000);
    }
  }, [user]);

  return (
    <DashboardContainer
      title="Reservas"
      description="Administra las reservas de tus espacios deportivos"
    >
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : reservas.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">Espacio</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">Cliente</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">Fecha</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">Hora</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">Estado</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {/* Ejemplo de fila */}
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                <td className="px-4 py-3 text-sm border-b border-gray-200 dark:border-gray-700">Cancha de Fútbol</td>
                <td className="px-4 py-3 text-sm border-b border-gray-200 dark:border-gray-700">Juan Pérez</td>
                <td className="px-4 py-3 text-sm border-b border-gray-200 dark:border-gray-700">15/07/2023</td>
                <td className="px-4 py-3 text-sm border-b border-gray-200 dark:border-gray-700">18:00 - 19:00</td>
                <td className="px-4 py-3 text-sm border-b border-gray-200 dark:border-gray-700">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Confirmada
                  </span>
                </td>
                <td className="px-4 py-3 text-sm border-b border-gray-200 dark:border-gray-700">
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-2">
                    Ver
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 px-4">
          <svg className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">No tienes reservas</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Cuando los usuarios reserven tus espacios deportivos, podrás gestionar todas las reservas desde aquí.
          </p>
        </div>
      )}
    </DashboardContainer>
  );
} 