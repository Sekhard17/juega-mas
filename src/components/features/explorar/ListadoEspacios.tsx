"use client";

import { FC, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  StarIcon, 
  MapPinIcon, 
  UserGroupIcon, 
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/solid";
import { ViewMode } from "@/lib/viewPreference";
import { EspacioDeportivo, FiltrosEspacios, PaginacionEspacios } from "@/types/espacio";
import { espaciosModel } from "@/models/espaciosModel";
import { motion } from "framer-motion";
import { formatCurrency } from '@/lib/utils';

interface ListadoEspaciosProps {
  viewMode: ViewMode;
  filtros: FiltrosEspacios;
  onPageChange: (newPage: number) => void;
  transformUrl?: (url: string) => string;
}

export const ListadoEspacios: FC<ListadoEspaciosProps> = ({ 
  viewMode, 
  filtros,
  onPageChange,
  transformUrl = (url) => url // Por defecto no modifica las URLs
}) => {
  const [espacios, setEspacios] = useState<EspacioDeportivo[]>([]);
  const [paginacion, setPaginacion] = useState<PaginacionEspacios>({
    total: 0,
    pagina_actual: 1,
    total_paginas: 0,
    por_pagina: 10
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar espacios deportivos
  useEffect(() => {
    const cargarEspacios = async () => {
      setCargando(true);
      setError(null);
      try {
        const resultado = await espaciosModel.listarEspacios(filtros);
        setEspacios(resultado.espacios);
        setPaginacion(resultado.paginacion);
      } catch (err) {
        console.error("Error al cargar espacios deportivos:", err);
        setError("No pudimos cargar los recintos deportivos. Por favor, intenta nuevamente.");
      } finally {
        setCargando(false);
      }
    };

    cargarEspacios();
  }, [filtros]);

  // Función para formatear capacidad
  const formatearCapacidad = (min?: number, max?: number) => {
    if (!min && !max) return "No especificada";
    if (min && !max) return `Mínimo ${min} personas`;
    if (!min && max) return `Hasta ${max} personas`;
    if (min === max) return `${min} personas`;
    return `${min} - ${max} personas`;
  };

  // Renderizar estado de carga
  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <ArrowPathIcon className="h-10 w-10 text-primary-500 animate-spin" />
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">Cargando recintos deportivos...</p>
      </div>
    );
  }

  // Renderizar estado de error
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-center">
        <p className="text-red-700 dark:text-red-400">{error}</p>
        <button 
          onClick={() => onPageChange(1)} 
          className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800/40 rounded-md text-red-700 dark:text-red-300 text-sm"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Renderizar mensaje cuando no hay resultados
  if (espacios.length === 0) {
    return (
      <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl p-8 text-center">
        <p className="text-zinc-600 dark:text-zinc-400 mb-2">
          No encontramos recintos deportivos con los filtros seleccionados.
        </p>
        <button 
          onClick={() => onPageChange(1)} 
          className="px-4 py-2 bg-primary-50 dark:bg-primary-900/30 rounded-md 
            text-primary-700 dark:text-primary-300 text-sm"
        >
          Limpiar filtros
        </button>
      </div>
    );
  }

  // Vista de tarjetas
  if (viewMode === "cards") {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {espacios.map((espacio) => (
            <Link href={transformUrl(`/explorar/espacios/${espacio.id}`)} key={espacio.id}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 h-full flex flex-col"
              >
                <div className="relative h-52 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 relative">
                    {espacio.imagen_principal ? (
                      <Image
                        src={espacio.imagen_principal}
                        alt={espacio.nombre}
                        className="object-cover group-hover:scale-105 transition-all duration-500"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  
                  {/* Tipo de espacio - tag superior izquierda */}
                  <div className="absolute top-3 left-3 z-20">
                    <span className="px-2.5 py-1.5 text-xs font-medium bg-emerald-500 text-white rounded-lg shadow-sm">
                      {espacio.tipo}
                    </span>
                  </div>
                  
                  {/* Precio - tag superior derecha */}
                  <div className="absolute top-3 right-3 z-20">
                    <div className="flex items-center bg-emerald-600/90 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm">
                      {formatCurrency(espacio.precio_base)}
                    </div>
                  </div>
                  
                  {/* Calificación */}
                  <div className="absolute bottom-3 right-3 z-20">
                    <div className="flex items-center bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-medium">
                      <StarIcon className="h-3.5 w-3.5 mr-1 text-yellow-400" />
                      {espacio.puntuacion_promedio?.toFixed(1) || "N/A"}
                    </div>
                  </div>
                  
                  {/* Nombre */}
                  <div className="absolute bottom-3 left-3 right-16 z-20">
                    <h3 className="text-lg font-bold text-white truncate group-hover:text-emerald-100 transition-colors">
                      {espacio.nombre}
                    </h3>
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
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {espacio.direccion}
                      </p>
                    </div>
                  </div>
                  
                  {/* Capacidad */}
                  <div className="flex items-center mt-3 text-gray-600 dark:text-gray-400 text-sm">
                    <UserGroupIcon className="h-4 w-4 mr-1.5 flex-shrink-0 text-emerald-500 dark:text-emerald-400" />
                    <span>{formatearCapacidad(espacio.capacidad_min, espacio.capacidad_max)}</span>
                  </div>
                  
                  {/* Características destacadas */}
                  {espacio.caracteristicas && espacio.caracteristicas.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {espacio.caracteristicas.slice(0, 3).map((caracteristica, idx) => (
                        <span 
                          key={idx} 
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                        >
                          {caracteristica.toString()}
                        </span>
                      ))}
                      {espacio.caracteristicas.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          +{espacio.caracteristicas.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Precio y CTA */}
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Desde
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                        {formatCurrency(espacio.precio_base)}
                      </span>
                    </div>
                    <button className="px-4 py-2 text-sm rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white transition-colors shadow-sm hover:shadow">
                      Ver detalles
                    </button>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Paginación */}
        {renderPaginacion()}
      </div>
    );
  }

  // Vista de tabla
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Espacio
              </th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Ubicación
              </th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tipo
              </th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Capacidad
              </th>
              <th scope="col" className="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Precio
              </th>
              <th scope="col" className="relative px-4 py-3.5">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {espacios.map((espacio, index) => (
              <tr 
                key={espacio.id} 
                className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-800/50'
                }`}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700 relative">
                      {espacio.imagen_principal ? (
                        <Image
                          src={espacio.imagen_principal}
                          alt={espacio.nombre}
                          className="h-10 w-10 object-cover"
                          width={40}
                          height={40}
                        />
                      ) : (
                        <div className="h-10 w-10 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">
                          Sin imagen
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {espacio.nombre}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <StarIcon className="h-3 w-3 text-yellow-400 mr-1" />
                        {espacio.puntuacion_promedio?.toFixed(1) || "N/A"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {espacio.ciudad}
                    {espacio.estado ? `, ${espacio.estado}` : ''}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                    {espacio.direccion}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300">
                    {espacio.tipo}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {formatearCapacidad(espacio.capacidad_min, espacio.capacidad_max)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(espacio.precio_base)}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link 
                    href={transformUrl(`/explorar/espacios/${espacio.id}`)} 
                    className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-medium"
                  >
                    Ver detalles
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {renderPaginacion()}
    </div>
  );

  // Función para renderizar la paginación
  function renderPaginacion() {
    if (paginacion.total_paginas <= 1) return null;
    
    return (
      <div className="flex justify-center mt-8">
        <nav className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(paginacion.pagina_actual - 1)}
            disabled={paginacion.pagina_actual === 1}
            className="p-2 rounded-md text-gray-500 dark:text-gray-400 
              hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 
              disabled:pointer-events-none"
            aria-label="Página anterior"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          
          {Array.from({ length: paginacion.total_paginas }).map((_, i) => {
            const pageNum = i + 1;
            const isCurrentPage = pageNum === paginacion.pagina_actual;
            
            // Mostrar solo páginas cercanas a la actual y puntos suspensivos
            if (
              pageNum === 1 ||
              pageNum === paginacion.total_paginas ||
              (pageNum >= paginacion.pagina_actual - 1 && pageNum <= paginacion.pagina_actual + 1)
            ) {
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-9 h-9 flex items-center justify-center rounded-md text-sm font-medium
                    ${isCurrentPage 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  aria-label={`Página ${pageNum}`}
                  aria-current={isCurrentPage ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              );
            } else if (
              (pageNum === 2 && paginacion.pagina_actual > 3) ||
              (pageNum === paginacion.total_paginas - 1 && paginacion.pagina_actual < paginacion.total_paginas - 2)
            ) {
              return <span key={pageNum} className="text-gray-400 mx-1">...</span>;
            }
            
            return null;
          })}
          
          <button
            onClick={() => onPageChange(paginacion.pagina_actual + 1)}
            disabled={paginacion.pagina_actual === paginacion.total_paginas}
            className="p-2 rounded-md text-gray-500 dark:text-gray-400 
              hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 
              disabled:pointer-events-none"
            aria-label="Página siguiente"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </nav>
      </div>
    );
  }
}; 