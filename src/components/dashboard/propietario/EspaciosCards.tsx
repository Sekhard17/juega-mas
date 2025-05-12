"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EspacioDeportivo } from '@/types/espacio';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { 
  MapPinIcon, 
  StarIcon, 
  UserGroupIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowPathIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '@/lib/utils';

interface EspaciosCardsProps {
  espacios: EspacioDeportivo[];
  onDelete: (id: number) => Promise<void>;
  onToggleEstado: (id: number, nuevoEstado: 'activo' | 'inactivo') => Promise<void>;
  isLoading: boolean;
}

export default function EspaciosCards({ 
  espacios, 
  onDelete, 
  onToggleEstado,
  isLoading 
}: EspaciosCardsProps) {
  const [pendingAction, setPendingAction] = useState<{ id: number; action: string } | null>(null);

  if (isLoading) {
    return (
      <div className="mt-4 text-center py-8">
        <ArrowPathIcon className="h-10 w-10 mx-auto text-emerald-500 animate-spin" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando espacios deportivos...</p>
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

  // Función para formatear capacidad
  const formatearCapacidad = (min?: number, max?: number) => {
    if (!min && !max) return "No especificada";
    if (min && !max) return `Mínimo ${min} personas`;
    if (!min && max) return `Hasta ${max} personas`;
    if (min === max) return `${min} personas`;
    return `${min} - ${max} personas`;
  };

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {espacios.map((espacio) => (
        <motion.div 
          key={espacio.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col h-full"
        >
          <div className="relative h-48 w-full">
            {espacio.imagen_principal ? (
              <Image
                src={espacio.imagen_principal}
                alt={espacio.nombre}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <svg className="h-16 w-16 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            
            {/* Estado - badge superior izquierda */}
            <div className="absolute top-3 left-3">
              <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${
                espacio.estado_espacio === 'activo' 
                  ? 'bg-emerald-500 text-white' 
                  : espacio.estado_espacio === 'inactivo'
                    ? 'bg-gray-500 text-white'
                    : 'bg-yellow-500 text-white'
              }`}>
                {espacio.estado_espacio === 'activo' 
                  ? 'Activo' 
                  : espacio.estado_espacio === 'inactivo'
                    ? 'Inactivo'
                    : 'Pendiente'}
              </span>
            </div>
            
            {/* Calificación - badge superior derecha */}
            <div className="absolute top-3 right-3">
              <div className="flex items-center bg-black/40 backdrop-blur-sm text-white px-2 py-1 rounded-lg">
                <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-xs font-medium">
                  {espacio.calificacion_promedio?.toFixed(1) || 'N/A'}
                </span>
              </div>
            </div>
            
            {/* Nombre del espacio */}
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="text-white font-bold text-lg truncate">
                {espacio.nombre}
              </h3>
              <p className="text-gray-200 text-sm truncate">
                {espacio.tipo}
              </p>
            </div>
          </div>
          
          <div className="p-4 flex-1 flex flex-col">
            {/* Ubicación */}
            <div className="flex items-start gap-1.5">
              <MapPinIcon className="h-5 w-5 flex-shrink-0 text-emerald-500 dark:text-emerald-400 mt-0.5" />
              <div>
                <p className="text-gray-700 dark:text-gray-200 font-medium">
                  {espacio.ciudad}{espacio.estado ? `, ${espacio.estado}` : ''}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {espacio.direccion}
                </p>
              </div>
            </div>
            
            {/* Capacidad */}
            <div className="flex items-center mt-3 text-gray-600 dark:text-gray-400 text-sm">
              <UserGroupIcon className="h-4 w-4 mr-1.5 flex-shrink-0 text-emerald-500 dark:text-emerald-400" />
              <span>{formatearCapacidad(espacio.capacidad_min, espacio.capacidad_max)}</span>
            </div>
            
            {/* Precio */}
            <div className="mt-3">
              <span className="text-xs text-gray-500 dark:text-gray-400">Precio por hora</span>
              <p className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                {formatCurrency(espacio.precio_hora || 0)}
              </p>
            </div>
            
            {/* Características */}
            {espacio.caracteristicas && espacio.caracteristicas.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {espacio.caracteristicas.slice(0, 3).map((caracteristica, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                  >
                    {caracteristica.nombre}
                  </span>
                ))}
                {espacio.caracteristicas.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    +{espacio.caracteristicas.length - 3}
                  </span>
                )}
              </div>
            )}
            
            {/* Acciones */}
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <Link
                href={`/dashboard/propietario/espacios/${espacio.id}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                <EyeIcon className="h-4 w-4" />
                Ver detalles
              </Link>
              
              <div className="flex items-center space-x-2">
                <Link
                  href={`/dashboard/propietario/espacios/${espacio.id}/editar`}
                  className="p-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <PencilIcon className="h-4 w-4" />
                </Link>
                
                <button
                  className={`p-1.5 rounded-full ${
                    espacio.estado_espacio === 'activo'
                      ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300'
                      : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300'
                  }`}
                  onClick={() => handleToggleEstado(espacio.id, espacio.estado_espacio)}
                  disabled={pendingAction?.id === espacio.id && pendingAction?.action === 'toggleEstado'}
                >
                  {pendingAction?.id === espacio.id && pendingAction?.action === 'toggleEstado' ? (
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  ) : espacio.estado_espacio === 'activo' ? (
                    <EyeSlashIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
                
                <button
                  className="p-1.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  onClick={() => {
                    if (confirm('¿Estás seguro de eliminar este espacio? Esta acción no se puede deshacer.')) {
                      handleDelete(espacio.id);
                    }
                  }}
                  disabled={pendingAction?.id === espacio.id && pendingAction?.action === 'delete'}
                >
                  {pendingAction?.id === espacio.id && pendingAction?.action === 'delete' ? (
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  ) : (
                    <TrashIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 