import { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, EyeIcon, BoltIcon } from '@heroicons/react/24/outline';
import { API_ROUTES } from '@/lib/apiConfig';
import { toast } from 'sonner';
import adminModel, { Usuario, ActualizarUsuario } from '@/models/adminModel';

interface UserManagementTableProps {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export function UserManagementTable({ isLoading, setIsLoading }: UserManagementTableProps) {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  
  // Estado para el modo de edición
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      // Usando el modelo adminModel en lugar de fetch directo
      const usuarios = await adminModel.obtenerUsuarios(currentPage, 10);
      
      setUsers(usuarios);
      // TODO: Obtener totalPages y totalUsers desde la API
      setTotalPages(Math.ceil(usuarios.length / 10) || 1);
      setTotalUsers(usuarios.length || 0);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar los usuarios');
      setUsers([]);
      setTotalPages(1);
      setTotalUsers(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleViewUser = async (userId: number) => {
    try {
      // Usando el modelo adminModel en lugar de fetch directo
      const usuario = await adminModel.obtenerDetallesUsuario(userId);
      if (!usuario) throw new Error('Error al cargar detalles del usuario');
      toast.info('Función en desarrollo');
    } catch (error) {
      toast.error('Error al cargar detalles del usuario');
    }
  };

  const handleEditUser = async (userId: number) => {
    try {
      // En lugar de buscar el usuario en la API, lo encontramos directamente en la lista
      const usuario = users.find(user => user.id === userId);
      
      if (!usuario) {
        throw new Error('Error al cargar usuario para editar');
      }
      
      // Añadimos un log para depuración
      console.log('Editando usuario:', usuario);
      
      setEditingUser(usuario);
      setShowEditModal(true);
      
      // Verificamos que el estado modal se actualice correctamente
      console.log('Modal debería estar visible ahora');
    } catch (error) {
      console.error('Error al editar usuario:', error);
      toast.error('Error al cargar usuario para editar');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;

    try {
      // Usando el modelo adminModel en lugar de fetch directo
      const success = await adminModel.eliminarUsuario(userId);
      if (!success) throw new Error('Error al eliminar usuario');

      toast.success('Usuario eliminado correctamente');
      fetchUsers();
    } catch (error) {
      toast.error('Error al eliminar el usuario');
    }
  };

  const handleToggleUserStatus = async (userId: number, currentStatus: string = 'activo') => {
    try {
      const nuevoEstado = currentStatus === 'activo' ? 'inactivo' : 'activo';
      const success = await adminModel.cambiarEstadoUsuario(userId, nuevoEstado as 'activo' | 'inactivo');
      
      if (!success) throw new Error('Error al cambiar estado del usuario');
      
      toast.success(`Usuario ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'} correctamente`);
      
      // Actualizar la lista de usuarios
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, estado: nuevoEstado } 
            : user
        )
      );
    } catch (error) {
      toast.error('Error al cambiar el estado del usuario');
    }
  };

  const handleUpdateUser = async (datos: ActualizarUsuario) => {
    if (!editingUser) return;
    
    try {
      setIsLoading(true);
      const usuarioActualizado = await adminModel.actualizarUsuario(editingUser.id, datos);
      
      if (!usuarioActualizado) throw new Error('Error al actualizar usuario');
      
      toast.success('Usuario actualizado correctamente');
      setShowEditModal(false);
      setEditingUser(null);
      
      // Recargar la lista de usuarios
      fetchUsers();
    } catch (error) {
      toast.error('Error al actualizar el usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    
    switch (status.toLowerCase()) {
      case 'activo':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'inactivo':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      case 'suspendido':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded mb-2"></div>
        ))}
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No hay usuarios para mostrar</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  onChange={handleSelectAll}
                  checked={selectedUsers.length === users.length}
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Usuario
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Rol
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Último Acceso
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Fecha Registro
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.nombre}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{user.role}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.estado || 'activo')}`}>
                    {user.estado || 'Activo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  No registrado
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleViewUser(user.id)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Ver detalles"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEditUser(user.id)}
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                      title="Editar usuario"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleToggleUserStatus(user.id, user.estado)}
                      className={`${
                        user.estado === 'inactivo' 
                          ? 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300' 
                          : 'text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300'
                      }`}
                      title={user.estado === 'inactivo' ? 'Activar usuario' : 'Desactivar usuario'}
                    >
                      <BoltIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      title="Eliminar usuario"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                Mostrando <span className="font-medium">{users.length > 0 ? (currentPage - 1) * 10 + 1 : 0}</span> a <span className="font-medium">{Math.min(currentPage * 10, totalUsers)}</span> de <span className="font-medium">{totalUsers}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Anterior</span>
                  &lt;
                </button>
                {/* Páginas */}
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border ${
                      currentPage === idx + 1
                        ? 'bg-blue-50 border-blue-500 text-blue-600 z-10'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    } text-sm font-medium`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Siguiente</span>
                  &gt;
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowEditModal(false)}></div>
          
          <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <EditUserForm 
              user={editingUser} 
              onSubmit={handleUpdateUser} 
              onCancel={() => {
                setShowEditModal(false);
                setEditingUser(null);
              }} 
            />
          </div>
        </div>
      )}
    </>
  );
}

interface EditUserFormProps {
  user: Usuario;
  onSubmit: (datos: ActualizarUsuario) => void;
  onCancel: () => void;
}

function EditUserForm({ user, onSubmit, onCancel }: EditUserFormProps) {
  const [formData, setFormData] = useState({
    nombre: user.nombre,
    email: user.email,
    role: user.role,
    telefono: user.telefono || '',
    estado: user.estado || 'activo'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4" id="modal-title">
        Editar Usuario
      </h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nombre
          </label>
          <input
            type="text"
            name="nombre"
            id="nombre"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Rol
          </label>
          <select
            name="role"
            id="role"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="admin">Admin</option>
            <option value="cliente">Cliente</option>
            <option value="propietario">Propietario</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Teléfono
          </label>
          <input
            type="tel"
            name="telefono"
            id="telefono"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.telefono}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label htmlFor="estado" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Estado
          </label>
          <select
            name="estado"
            id="estado"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.estado}
            onChange={handleChange}
            required
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="suspendido">Suspendido</option>
          </select>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Guardar
        </button>
      </div>
    </form>
  );
} 