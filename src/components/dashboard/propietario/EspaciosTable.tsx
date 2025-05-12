"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EspacioDeportivo } from '@/types/espacio';
import { toast } from 'sonner';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon, 
  ArrowPathIcon,
  EyeSlashIcon 
} from '@heroicons/react/24/outline';

interface EspaciosTableProps {
  espacios: EspacioDeportivo[];
  onDelete: (id: number) => Promise<void>;
  onToggleEstado: (id: number, nuevoEstado: 'activo' | 'inactivo') => Promise<void>;
  isLoading: boolean;
}

export default function EspaciosTable({ 
  espacios, 
  onDelete, 
  onToggleEstado,
  isLoading 
}: EspaciosTableProps) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [pendingAction, setPendingAction] = useState<{ id: number; action: string } | null>(null);

  if (isLoading) {
    return (
      <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 text-center">
          <ArrowPathIcon className="h-10 w-10 mx-auto text-emerald-500 animate-spin" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando espacios deportivos...</p>
        </div>
      </div>
    );
  }

  if (espacios.length === 0) {
    return (
      <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden p-6">
        <div className="text-center py-8">
          <svg className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">No tienes espacios deportivos</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Comienza a añadir tus espacios deportivos para que los usuarios puedan reservarlos.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/espacios/nuevo"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Crear mi primer espacio
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const handleDelete = async (id: number) => {
    try {
      setPendingAction({ id, action: 'delete' });
      await onDelete(id);
      toast.success('Espacio eliminado correctamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('No se pudo eliminar el espacio');
    } finally {
      setPendingAction(null);
    }
  };

  const handleToggleEstado = async (id: number, estadoActual: string) => {
    try {
      const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';
      setPendingAction({ id, action: 'toggleEstado' });
      await onToggleEstado(id, nuevoEstado as 'activo' | 'inactivo');
      toast.success(`Espacio ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'} correctamente`);
    } catch (error) {
      console.error('Error:', error);
      toast.error(`No se pudo cambiar el estado del espacio`);
    } finally {
      setPendingAction(null);
    }
  };

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return 'N/A';
    return amount.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/30">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Espacio
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Ubicación
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Precio
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Calificación
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {espacios.map((espacio) => (
              <tr 
                key={espacio.id} 
                className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150"
                onClick={() => setExpandedRow(expandedRow === espacio.id ? null : espacio.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden relative bg-gray-200 dark:bg-gray-700">
                      {espacio.imagen_principal ? (
                        <Image
                          src={espacio.imagen_principal}
                          alt={espacio.nombre}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {espacio.nombre}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {espacio.tipo}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-100">{espacio.ciudad}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                    {espacio.direccion}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(espacio.precio_hora)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">por hora</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${espacio.estado_espacio === 'activo' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : espacio.estado_espacio === 'inactivo'
                        ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}
                  `}>
                    {espacio.estado_espacio === 'activo' 
                      ? 'Activo' 
                      : espacio.estado_espacio === 'inactivo'
                        ? 'Inactivo'
                        : 'Pendiente'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-sm text-gray-700 dark:text-gray-300">
                      {espacio.calificacion_promedio?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end items-center space-x-2">
                    <Link
                      href={`/dashboard/propietario/espacios/${espacio.id}`}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <EyeIcon className="w-5 h-5" />
                    </Link>
                    <Link
                      href={`/dashboard/propietario/espacios/${espacio.id}/editar`}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <PencilIcon className="w-5 h-5" />
                    </Link>
                    <button
                      className={`${
                        espacio.estado_espacio === 'activo'
                          ? 'text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300'
                          : 'text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleEstado(espacio.id, espacio.estado_espacio);
                      }}
                      disabled={pendingAction?.id === espacio.id && pendingAction?.action === 'toggleEstado'}
                    >
                      {pendingAction?.id === espacio.id && pendingAction?.action === 'toggleEstado' ? (
                        <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      ) : espacio.estado_espacio === 'activo' ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('¿Estás seguro de eliminar este espacio? Esta acción no se puede deshacer.')) {
                          handleDelete(espacio.id);
                        }
                      }}
                      disabled={pendingAction?.id === espacio.id && pendingAction?.action === 'delete'}
                    >
                      {pendingAction?.id === espacio.id && pendingAction?.action === 'delete' ? (
                        <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      ) : (
                        <TrashIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 