'use client';

import { useState, useEffect } from 'react';
import RoleGuard from '@/components/dashboard/shared/RoleGuard';
import { UserManagementTable } from '@/components/dashboard/admin/usuarios/UserManagementTable';
import { UserFilters } from '@/components/dashboard/admin/usuarios/UserFilters';
import { UserStats } from '@/components/dashboard/admin/usuarios/UserStats';
import { CreateUserForm } from '@/components/dashboard/admin/usuarios/CreateUserForm';
import adminModel, { NuevoUsuario } from '@/models/adminModel';
import { toast } from 'sonner';

export default function UsersManagementPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  useEffect(() => {
    document.title = 'Gestión de Usuarios | JuegaMás';
  }, []);

  const handleCreateUser = async (nuevoUsuario: NuevoUsuario) => {
    try {
      const usuario = await adminModel.crearUsuario(nuevoUsuario);
      if (!usuario) throw new Error('Error al crear usuario');
      
      toast.success('Usuario creado correctamente');
      setShowCreateModal(false);
      
      // Recargar tabla para mostrar el nuevo usuario
      // La tabla se recarga automáticamente al cambiar algún estado
      setIsLoading(true);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      toast.error('Error al crear el usuario');
    }
  };

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
          <UserFilters 
            onCreateUser={() => setShowCreateModal(true)} 
          />

          {/* Tabla de usuarios */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <UserManagementTable 
              isLoading={isLoading} 
              setIsLoading={setIsLoading}
            />
          </div>
        </div>
      </div>

      {/* Modal para crear usuarios */}
      {showCreateModal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowCreateModal(false)}></div>
          
          <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <CreateUserForm 
              onSubmit={handleCreateUser} 
              onCancel={() => setShowCreateModal(false)} 
            />
          </div>
        </div>
      )}
    </RoleGuard>
  );
} 