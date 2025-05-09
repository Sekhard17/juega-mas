'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface DashboardHeaderProps {
  title: string;
}

export default function DashboardHeader({ title }: DashboardHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Manejar logout
  const handleLogout = async () => {
    await logout();
    toast.success('Sesión cerrada correctamente');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Hola, {user?.nombre || 'Usuario'}
          </span>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
} 