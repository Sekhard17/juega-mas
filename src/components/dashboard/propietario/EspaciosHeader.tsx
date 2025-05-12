"use client";

import { useState } from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { ViewMode } from '@/lib/viewPreference';
import { FiltrosEspacios } from '@/types/espacio';

interface EspaciosHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onSearch: (query: string) => void;
  onFilterChange: (filtros: Partial<FiltrosEspacios>) => void;
  filtrosActuales: FiltrosEspacios;
}

export default function EspaciosHeader({
  viewMode,
  onViewModeChange,
  onSearch,
  onFilterChange,
  filtrosActuales
}: EspaciosHeaderProps) {
  const [busqueda, setBusqueda] = useState(filtrosActuales.busqueda || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(busqueda);
  };

  const handleFilterChange = (key: keyof FiltrosEspacios, value: any) => {
    onFilterChange({ [key]: value });
  };

  return (
    <div className="mb-3 space-y-3">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Mis Espacios Deportivos</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Gestiona y optimiza tus instalaciones deportivas en un solo lugar</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2.5 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-2">
          {/* Búsqueda */}
          <div className="flex-1">
            <form onSubmit={handleSearch} className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o dirección..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-700 dark:text-emerald-100 rounded-md text-sm font-medium"
              >
                Buscar
              </button>
            </form>
          </div>

          {/* Filtros adicionales */}
          <div className="flex items-center gap-3">
            <select
              value={filtrosActuales.estado_espacio || ''}
              onChange={(e) => handleFilterChange('estado_espacio', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Estado</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="pendiente">Pendiente</option>
            </select>

            <select
              value={filtrosActuales.ordenar_por || ''}
              onChange={(e) => handleFilterChange('ordenar_por', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Ordenar por</option>
              <option value="precio_asc">Precio: menor a mayor</option>
              <option value="precio_desc">Precio: mayor a menor</option>
              <option value="calificacion">Mejor calificación</option>
              <option value="popularidad">Más populares</option>
            </select>

            {/* Selector de vista */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('cards')}
                className={`px-3 py-1.5 rounded-md flex items-center ${
                  viewMode === 'cards'
                    ? 'bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => onViewModeChange('table')}
                className={`px-3 py-1.5 rounded-md flex items-center ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <Link
              href="/dashboard/espacios/nuevo"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-sm"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Crear Espacio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 