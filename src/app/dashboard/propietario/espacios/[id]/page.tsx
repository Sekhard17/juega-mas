"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { espaciosModel } from '@/models/espaciosModel';
import { EspacioDeportivo } from '@/types/espacio';
import { toast } from 'sonner';
import { 
  ArrowLeftIcon, 
  MapPinIcon,
  UserGroupIcon,
  ClockIcon,
  TagIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '@/lib/utils';

export default function DetalleEspacioPage() {
  const params = useParams();
  const router = useRouter();
  const espacioId = parseInt(params.id as string);
  
  const [espacio, setEspacio] = useState<EspacioDeportivo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eliminating, setEliminating] = useState(false);

  useEffect(() => {
    const cargarEspacio = async () => {
      try {
        setLoading(true);
        const resultado = await espaciosModel.getEspacioById(espacioId);
        
        // Verificar si hay datos válidos
        if (resultado && resultado.data && !resultado.error) {
          setEspacio(resultado.data as EspacioDeportivo);
        } else {
          setError('No se encontró el espacio deportivo');
        }
      } catch (error) {
        console.error('Error al cargar el espacio:', error);
        setError('No se pudo cargar la información del espacio deportivo');
        toast.error('Error al cargar la información del espacio');
      } finally {
        setLoading(false);
      }
    };

    if (espacioId && !isNaN(espacioId)) {
      cargarEspacio();
    } else {
      setError('ID de espacio inválido');
      setLoading(false);
    }
  }, [espacioId]);

  const handleEliminar = async () => {
    if (!confirm('¿Estás seguro de eliminar este espacio? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setEliminating(true);
      await espaciosModel.deleteEspacio(espacioId);
      toast.success('Espacio eliminado correctamente');
      router.push('/dashboard/propietario/espacios');
    } catch (error) {
      console.error('Error al eliminar el espacio:', error);
      toast.error('No se pudo eliminar el espacio');
    } finally {
      setEliminating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6">
        <div className="flex justify-center items-center h-64">
          <ArrowPathIcon className="h-10 w-10 text-emerald-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !espacio) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
            {error || 'No se encontró la información del espacio'}
          </h3>
          <div className="mt-6">
            <Link 
              href="/dashboard/propietario/espacios" 
              className="inline-flex items-center text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Volver a mis espacios
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Formateador para capacidad
  const formatearCapacidad = (min?: number, max?: number) => {
    if (!min && !max) return "No especificada";
    if (min && !max) return `Mínimo ${min} personas`;
    if (!min && max) return `Hasta ${max} personas`;
    if (min === max) return `${min} personas`;
    return `${min} - ${max} personas`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:px-6">
      {/* Cabecera con acciones */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center">
          <Link 
            href="/dashboard/propietario/espacios" 
            className="mr-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{espacio.nombre}</h1>
          <span className={`ml-3 px-2.5 py-0.5 text-xs font-medium rounded-full ${
            espacio.estado_espacio === 'activo' 
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' 
              : espacio.estado_espacio === 'inactivo'
                ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
          }`}>
            {espacio.estado_espacio === 'activo' 
              ? 'Activo' 
              : espacio.estado_espacio === 'inactivo'
                ? 'Inactivo'
                : 'Pendiente'}
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Link
            href={`/dashboard/propietario/espacios/${espacio.id}/editar`}
            className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/40"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            Editar
          </Link>
          <button
            onClick={handleEliminar}
            disabled={eliminating}
            className="inline-flex items-center px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/40"
          >
            {eliminating ? (
              <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <TrashIcon className="h-5 w-5 mr-2" />
            )}
            Eliminar
          </button>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda - Información general */}
        <div className="lg:col-span-2 space-y-6">
          {/* Imágenes */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="relative h-72 w-full">
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
            </div>
            
            {/* Galería de imágenes miniatura */}
            {espacio.imagenes && espacio.imagenes.length > 0 && (
              <div className="flex overflow-x-auto p-4 space-x-3">
                {espacio.imagenes.map((imagen, index) => (
                  <div key={index} className="flex-shrink-0 w-20 h-20 relative rounded-md overflow-hidden">
                    <Image
                      src={imagen.url}
                      alt={`${espacio.nombre} - Imagen ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Descripción */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Descripción</h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {espacio.descripcion || 'Este espacio no tiene una descripción.'}
            </p>
          </div>
          
          {/* Ubicación */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Ubicación</h2>
            <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
              <MapPinIcon className="h-5 w-5 flex-shrink-0 text-emerald-500 dark:text-emerald-400 mt-0.5" />
              <div>
                <p className="font-medium">
                  {espacio.ciudad}{espacio.estado ? `, ${espacio.estado}` : ''}
                </p>
                <p>{espacio.direccion}</p>
                {espacio.codigo_postal && <p>CP: {espacio.codigo_postal}</p>}
              </div>
            </div>
            
            {/* Mapa estático (placeholder) */}
            <div className="mt-4 bg-gray-200 dark:bg-gray-700 h-64 rounded-lg overflow-hidden relative">
              {(espacio.latitud && espacio.longitud) ? (
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBcKGkE8-U_LiAoVVGKLW-1ZU-ed8hPFc0&q=${espacio.latitud},${espacio.longitud}&zoom=15`}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 dark:text-gray-400">No hay coordenadas para mostrar el mapa</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Columna derecha - Detalles y estadísticas */}
        <div className="space-y-6">
          {/* Detalles del espacio */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Detalles</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <TagIcon className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tipo de espacio</p>
                  <p className="text-gray-900 dark:text-white font-medium">{espacio.tipo}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <UserGroupIcon className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Capacidad</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {formatearCapacidad(espacio.capacidad_min, espacio.capacidad_max)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Duración del turno</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {espacio.duracion_turno} minutos
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <svg className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Precio por hora</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {formatCurrency(espacio.precio_hora || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Características */}
          {espacio.caracteristicas && espacio.caracteristicas.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Características</h2>
              
              <div className="flex flex-wrap gap-2">
                {espacio.caracteristicas.map((caracteristica, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                  >
                    {caracteristica.nombre}
                    {caracteristica.valor && caracteristica.valor !== 'si' && `: ${caracteristica.valor}`}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Estadísticas */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Estadísticas</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
                <p className="text-emerald-600 dark:text-emerald-400 text-2xl font-bold">
                  {espacio.calificacion_promedio?.toFixed(1) || 'N/A'}
                </p>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">Calificación</p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-blue-600 dark:text-blue-400 text-2xl font-bold">
                  {espacio.total_resenas || 0}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">Reseñas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 