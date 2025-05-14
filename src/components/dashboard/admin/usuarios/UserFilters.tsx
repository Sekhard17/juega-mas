import { MagnifyingGlassIcon, FunnelIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface UserFiltersProps {
  onFilterChange?: (filters: any) => void;
  onCreateUser?: () => void;
}

export function UserFilters({ onFilterChange, onCreateUser }: UserFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    role: 'todos',
    estado: 'todos',
    fechaRegistro: 'todos'
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-0">
          Filtros y búsqueda
        </h2>
        <button
          type="button"
          onClick={onCreateUser}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <UserPlusIcon className="h-5 w-5 mr-2" />
          Crear Usuario
        </button>
      </div>
      
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Buscar usuarios por nombre, email o teléfono"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <button
          type="button"
          onClick={() => setAdvancedFiltersOpen(!advancedFiltersOpen)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FunnelIcon className="h-5 w-5 mr-2 text-gray-400" aria-hidden="true" />
          Filtros Avanzados
        </button>
      </div>
      
      {advancedFiltersOpen && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Rol
            </label>
            <select
              id="role"
              name="role"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
              value={filters.role}
              onChange={handleFilterChange}
            >
              <option value="todos">Todos</option>
              <option value="admin">Administrador</option>
              <option value="cliente">Cliente</option>
              <option value="propietario">Propietario</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Estado
            </label>
            <select
              id="estado"
              name="estado"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
              value={filters.estado}
              onChange={handleFilterChange}
            >
              <option value="todos">Todos</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="suspendido">Suspendido</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="fechaRegistro" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Fecha de registro
            </label>
            <select
              id="fechaRegistro"
              name="fechaRegistro"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
              value={filters.fechaRegistro}
              onChange={handleFilterChange}
            >
              <option value="todos">Todos</option>
              <option value="hoy">Hoy</option>
              <option value="estaSemana">Esta semana</option>
              <option value="esteMes">Este mes</option>
              <option value="esteAño">Este año</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
} 