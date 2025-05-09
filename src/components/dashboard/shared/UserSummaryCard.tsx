'use client';

import { useAuth } from '@/providers/AuthProvider';

export default function UserSummaryCard() {
  const { user } = useAuth();

  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Resumen</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Email:</span>
            <span className="font-medium text-gray-900 dark:text-white">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Rol:</span>
            <span className="font-medium text-gray-900 dark:text-white capitalize">{user?.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Cuenta creada:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 