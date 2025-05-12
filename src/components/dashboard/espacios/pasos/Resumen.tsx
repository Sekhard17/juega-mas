'use client';

import { EspacioDeportivo } from '@/types/espacio';
import Image from 'next/image';
import { CheckCircleIcon, MapPinIcon, UserGroupIcon, ClockIcon, BuildingLibraryIcon, CurrencyDollarIcon, CalendarDaysIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';

interface ResumenProps {
  datos: Partial<EspacioDeportivo>;
  crearEspacio: () => void;
  pasoAnterior: () => void;
  cargando: boolean;
  creado: boolean;
}

export default function Resumen({
  datos,
  crearEspacio,
  pasoAnterior,
  cargando,
  creado
}: ResumenProps) {
  // Nombres de los días de la semana
  const diasSemana = [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ];

  // Convertir las características en un objeto para mostrarlas fácilmente
  const caracteristicasObj: Record<string, string> = {};
  datos.caracteristicas?.forEach(c => {
    caracteristicasObj[c.nombre] = c.valor;
  });

  // Agrupar horarios por día
  const horariosPorDia: Record<string, Array<{hora_inicio: string, hora_fin: string, precio_especial?: number}>> = {};
  
  if (datos.horarios && datos.horarios.length > 0) {
    // Ordenar los horarios por día de la semana y hora de inicio
    const horariosOrdenados = [...datos.horarios].sort((a, b) => {
      if (a.dia_semana !== b.dia_semana) {
        return a.dia_semana - b.dia_semana;
      }
      return a.hora_inicio.localeCompare(b.hora_inicio);
    });
    
    // Agrupar por día
    horariosOrdenados.forEach(h => {
      const dia = diasSemana[h.dia_semana];
      if (!horariosPorDia[dia]) {
        horariosPorDia[dia] = [];
      }
      horariosPorDia[dia].push({
        hora_inicio: h.hora_inicio,
        hora_fin: h.hora_fin,
        precio_especial: h.precio_especial
      });
    });
  }

  // Renderizar sección exitosa
  if (creado) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center py-10 space-y-6 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
          <CheckCircleIcon className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          ¡Espacio creado con éxito!
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 max-w-md">
          Tu espacio deportivo "{datos.nombre}" ha sido creado correctamente. Serás redirigido en unos segundos.
        </p>
        
        <div className="w-full max-w-sm h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 3 }}
          />
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Confirma tu espacio deportivo
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Verifica todos los datos antes de publicar tu espacio.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Columna izquierda: Datos del espacio e imagen */}
        <div className="md:col-span-3 space-y-6">
          {/* Tarjeta principal con la información del espacio */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Imagen principal si existe */}
            {datos.imagen_principal && (
              <div className="relative h-52 w-full">
                <Image 
                  src={datos.imagen_principal} 
                  alt={datos.nombre || 'Espacio deportivo'} 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h1 className="text-2xl font-bold text-white">{datos.nombre}</h1>
                  <div className="flex items-center text-white/90 text-sm mt-1">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    <span>{datos.ciudad}{datos.estado ? `, ${datos.estado}` : ''}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Información organizada en secciones */}
            <div className="p-4 space-y-5">
              {/* Sección: Información básica */}
              <div className="flex items-start space-x-3">
                <BuildingLibraryIcon className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">Información básica</h3>
                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Tipo:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{datos.tipo}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Duración:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{datos.duracion_turno} min</p>
                    </div>
                    {datos.capacidad_min && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Capacidad mín:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{datos.capacidad_min} personas</p>
                      </div>
                    )}
                    {datos.capacidad_max && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Capacidad máx:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{datos.capacidad_max} personas</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Sección: Ubicación */}
              <div className="flex items-start space-x-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <MapPinIcon className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">Ubicación</h3>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{datos.direccion}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {datos.ciudad}{datos.estado ? `, ${datos.estado}` : ''}{datos.codigo_postal ? ` (${datos.codigo_postal})` : ''}
                  </p>
                </div>
              </div>

              {/* Sección: Características principales (mostrar solo 6) */}
              {datos.caracteristicas && datos.caracteristicas.length > 0 && (
                <div className="flex items-start space-x-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">Características principales</h3>
                    <ul className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1">
                      {datos.caracteristicas.slice(0, 6).map((c, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <span className={`w-2 h-2 rounded-full mr-2 ${
                            c.valor === 'si' ? 'bg-emerald-500' : 
                            c.valor === 'parcial' ? 'bg-amber-500' : 'bg-gray-300'
                          }`}></span>
                          <span className={c.valor === 'no' ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-300'}>
                            {c.nombre}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {datos.caracteristicas.length > 6 && (
                      <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                        +{datos.caracteristicas.length - 6} características más
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Sección: Descripción si existe */}
              {datos.descripcion && (
                <div className="flex items-start space-x-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">Descripción</h3>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                      {datos.descripcion}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Galería de imágenes si hay más de 1 */}
          {datos.imagenes && datos.imagenes.length > 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center space-x-2 mb-3">
                <PhotoIcon className="w-5 h-5 text-emerald-500" />
                <h3 className="font-medium text-gray-900 dark:text-white">Galería ({datos.imagenes.length} imágenes)</h3>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {datos.imagenes.slice(0, 8).map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                    <Image 
                      src={img.url} 
                      alt={`Imagen ${index + 1}`} 
                      fill 
                      className="object-cover" 
                    />
                    {img.url === datos.imagen_principal && (
                      <div className="absolute bottom-0 left-0 right-0 bg-emerald-500 text-white text-xs text-center py-0.5">
                        Principal
                      </div>
                    )}
                  </div>
                ))}
                {datos.imagenes.length > 8 && (
                  <div className="relative aspect-square rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-600 dark:text-gray-300 font-medium">+{datos.imagenes.length - 8}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Horarios */}
          {Object.keys(horariosPorDia).length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center space-x-2 mb-3">
                <CalendarDaysIcon className="w-5 h-5 text-emerald-500" />
                <h3 className="font-medium text-gray-900 dark:text-white">Horarios disponibles</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(horariosPorDia).map(([dia, horarios]) => (
                  <div key={dia} className="border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{dia}</p>
                    <div className="mt-1 space-y-1">
                      {horarios.map((h, idx) => (
                        <div key={idx} className="text-xs text-gray-700 dark:text-gray-300 flex justify-between">
                          <span>{h.hora_inicio} - {h.hora_fin}</span>
                          {h.precio_especial && (
                            <span className="text-emerald-600 dark:text-emerald-400">{formatCurrency(h.precio_especial)}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Columna derecha: Resumen y botones de acción */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sticky top-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Resumen de precios</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Precio base</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(datos.precio_base || 0)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Precio por hora</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(datos.precio_hora || 0)}</span>
              </div>
              
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                <span className="font-medium text-gray-900 dark:text-white">Precio total (1h)</span>
                <span className="font-bold text-emerald-600">
                  {formatCurrency((datos.precio_base || 0) + (datos.precio_hora || 0))}
                </span>
              </div>
            </div>
            
            <div className="mt-8 space-y-4">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200 p-3 rounded-lg text-sm flex items-start">
                <CheckCircleSolid className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                <p>Tu espacio será revisado antes de ser publicado. Los usuarios podrán encontrarlo y reservarlo una vez sea aprobado.</p>
              </div>
              
              <button
                type="button"
                onClick={crearEspacio}
                disabled={cargando}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center disabled:bg-emerald-400 disabled:cursor-not-allowed"
              >
                {cargando ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creando espacio...
                  </>
                ) : 'Publicar espacio'}
              </button>
              
              <button
                type="button"
                onClick={pasoAnterior}
                disabled={cargando}
                className="w-full py-3 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Revisar imágenes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 