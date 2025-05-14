'use client';

import { useState, useEffect } from 'react';
import RoleGuard from '@/components/dashboard/shared/RoleGuard';
import { UserManagementTable } from '@/components/dashboard/admin/usuarios/UserManagementTable';
import { UserFilters } from '@/components/dashboard/admin/usuarios/UserFilters';
import { UserStats } from '@/components/dashboard/admin/usuarios/UserStats';

export default function UsersManagementPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    document.title = 'Gestión de Usuarios | JuegaMás';
  }, []);

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Encabezado */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gestión de Usuarios
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Administra todos los usuarios de la plataforma de manera eficiente
            </p>
          </div>

          {/* Estadísticas de usuarios */}
          <UserStats isLoading={isLoading} />

          {/* Filtros y búsqueda */}
          <UserFilters />

          {/* Tabla de usuarios */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <UserManagementTable 
              isLoading={isLoading} 
              setIsLoading={setIsLoading}
            />
          </div>
        </div>
      </div>
    </RoleGuard>
  );
} 