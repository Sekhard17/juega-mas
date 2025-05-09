'use client';

import { useAuth } from '@/providers/AuthProvider';

export default function RecentActivityCard() {
  const { user } = useAuth();

  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Actividad reciente</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-emerald-500 pl-4 py-2">
            <p className="text-sm text-gray-900 dark:text-white">Inicio de sesión exitoso</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Hace unos momentos</p>
          </div>
          <div className="border-l-4 border-gray-300 pl-4 py-2">
            <p className="text-sm text-gray-900 dark:text-white">Cuenta creada</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 