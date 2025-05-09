'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardContainer } from '@/components/dashboard';
import { RoleGuard } from '@/components/dashboard';
import { incidenciasModel } from '@/models/incidenciasModel';
import { Incidencia, getColorEstadoIncidencia } from '@/types/incidencia';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function DetalleIncidenciaPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const [incidencia, setIncidencia] = useState<Incidencia | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormularioActualizar, setMostrarFormularioActualizar] = useState(false);
  const [descripcionAdicional, setDescripcionAdicional] = useState('');
  const [enviandoActualizacion, setEnviandoActualizacion] = useState(false);
  const [modalConfirmacion, setModalConfirmacion] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  // Actualizar el título de forma dinámica
  useEffect(() => {
    document.title = incidencia 
      ? `Incidencia: ${incidencia.asunto} | JuegaMás` 
      : 'Detalle de Incidencia | JuegaMás';
  }, [incidencia]);

  // Cargar detalle de la incidencia
  useEffect(() => {
    const cargarIncidencia = async () => {
      setCargando(true);
      setError(null);
      try {
        const detalleIncidencia = await incidenciasModel.obtenerIncidencia(params.id);
        if (!detalleIncidencia) {
          setError('No se encontró la incidencia solicitada');
        } else {
          setIncidencia(detalleIncidencia);
        }
      } catch (err) {
        console.error('Error al cargar detalle de incidencia:', err);
        setError('Ocurrió un error al cargar los datos de la incidencia');
      } finally {
        setCargando(false);
      }
    };
    
    cargarIncidencia();
  }, [params.id]);

  // Manejar actualización de la incidencia
  const handleActualizarIncidencia = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (descripcionAdicional.trim().length < 10) {
      setError('Por favor, proporciona una descripción más detallada (mínimo 10 caracteres)');
      return;
    }
    
    setEnviandoActualizacion(true);
    setError(null);
    
    try {
      const resultado = await incidenciasModel.actualizarIncidencia(
        params.id,
        { descripcion: incidencia?.descripcion + '\n\n--- ACTUALIZACIÓN ---\n' + descripcionAdicional }
      );
      
      if (resultado.success) {
        setMostrarFormularioActualizar(false);
        setMensajeExito('La información se ha actualizado correctamente');
        
        // Recargar la incidencia
        const detalleActualizado = await incidenciasModel.obtenerIncidencia(params.id);
        if (detalleActualizado) {
          setIncidencia(detalleActualizado);
        }
      } else {
        setError(resultado.message);
      }
    } catch (err) {
      console.error('Error al actualizar incidencia:', err);
      setError('Ocurrió un error al actualizar la información');
    } finally {
      setEnviandoActualizacion(false);
    }
  };

  // Manejar cierre de la incidencia
  const handleCerrarIncidencia = async () => {
    try {
      const resultado = await incidenciasModel.cerrarIncidencia(params.id);
      
      if (resultado.success) {
        setModalConfirmacion(false);
        setMensajeExito('La incidencia se ha cerrado correctamente');
        
        // Recargar la incidencia
        const detalleActualizado = await incidenciasModel.obtenerIncidencia(params.id);
        if (detalleActualizado) {
          setIncidencia(detalleActualizado);
        }
      } else {
        setError(resultado.message);
      }
    } catch (err) {
      console.error('Error al cerrar incidencia:', err);
      setError('Ocurrió un error al cerrar la incidencia');
    }
  };

  // Funciones auxiliares para formatear datos
  const formatearEstado = (estado: string): string => {
    switch (estado) {
      case 'pendiente': return 'Pendiente';
      case 'en_revision': return 'En revisión';
      case 'resuelta': return 'Resuelta';
      case 'cerrada': return 'Cerrada';
      default: return estado;
    }
  };

  const formatearTipo = (tipo: string): string => {
    switch (tipo) {
      case 'problema_reserva': return 'Problema con una reserva';
      case 'problema_espacio': return 'Problema con un espacio deportivo';
      case 'problema_pago': return 'Problema con un pago';
      case 'problema_acceso': return 'Problema de acceso a la plataforma';
      case 'sugerencia': return 'Sugerencia de mejora';
      case 'otro': return 'Otro tipo de problema';
      default: return tipo;
    }
  };

  const formatearFecha = (fecha: string): string => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Verificar si la incidencia puede ser cerrada
  const puedeSerCerrada = (): boolean => {
    if (!incidencia) return false;
    return ['pendiente', 'en_revision'].includes(incidencia.estado);
  };

  // Verificar si se puede agregar información adicional
  const puedeSrActualizada = (): boolean => {
    if (!incidencia) return false;
    return ['pendiente', 'en_revision'].includes(incidencia.estado);
  };

  // Renderizar pantalla de carga
  if (cargando) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // Renderizar error
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
        <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error al cargar la incidencia</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
        <Link 
          href="/dashboard/cliente/reportar-problema" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" /> Volver a mis incidencias
        </Link>
      </div>
    );
  }

  // Renderizar si no se encuentra la incidencia
  if (!incidencia) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
        <ExclamationTriangleIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No se encontró la incidencia</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">La incidencia que buscas no existe o no tienes acceso a ella.</p>
        <Link 
          href="/dashboard/cliente/reportar-problema" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" /> Volver a mis incidencias
        </Link>
      </div>
    );
  }

  // Obtener colores según el estado
  const colores = getColorEstadoIncidencia(incidencia.estado);

  return (
    <RoleGuard allowedRoles={['cliente', 'usuario']}>
      <div className="space-y-6">
        {/* Mensaje de éxito */}
        {mensajeExito && (
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start mb-6">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-green-800 dark:text-green-200">{mensajeExito}</p>
            </div>
          </div>
        )}
        
        {/* Cabecera con botón de volver */}
        <div className="flex items-center mb-6">
          <Link
            href="/dashboard/cliente/reportar-problema"
            className="inline-flex items-center mr-4 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Volver a mis incidencias
          </Link>
        </div>
        
        {/* Contenedor principal */}
        <DashboardContainer
          title="Detalle de la Incidencia"
          description={formatearEstado(incidencia.estado)}
          actions={
            puedeSerCerrada() ? (
              <button
                onClick={() => setModalConfirmacion(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <XCircleIcon className="h-4 w-4 mr-1.5" />
                Cerrar incidencia
              </button>
            ) : null
          }
        >
          <div className="space-y-8">
            {/* Información principal */}
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{incidencia.asunto}</h2>
                <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="mr-2">{formatearTipo(incidencia.tipo)}</span>
                  <span className="mx-2">•</span>
                  <span>Creada el {formatearFecha(incidencia.fecha_creacion)}</span>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {incidencia.descripcion.split('\n').map((line, i) => (
                    <p key={i} className={line.includes('--- ACTUALIZACIÓN ---') ? 'font-semibold text-emerald-700 dark:text-emerald-400' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Respuesta (si existe) */}
            {incidencia.respuesta && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-emerald-500 mr-2" />
                  Respuesta del equipo de soporte
                </h3>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                  <div className="prose prose-sm dark:prose-invert max-w-none text-blue-800 dark:text-blue-300">
                    {incidencia.respuesta.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Formulario para añadir información adicional */}
            {puedeSrActualizada() && !mostrarFormularioActualizar && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setMostrarFormularioActualizar(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Añadir información adicional
                </button>
              </div>
            )}
            
            {mostrarFormularioActualizar && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Añadir información adicional
                </h3>
                
                {error && (
                  <div className="p-4 mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleActualizarIncidencia} className="space-y-4">
                  <div>
                    <label htmlFor="descripcionAdicional" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Información adicional
                    </label>
                    <textarea
                      id="descripcionAdicional"
                      value={descripcionAdicional}
                      onChange={(e) => setDescripcionAdicional(e.target.value)}
                      rows={5}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                      placeholder="Proporciona más detalles o actualiza la información sobre esta incidencia."
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Mínimo 10 caracteres. Esta información se añadirá a tu incidencia original.
                    </p>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setMostrarFormularioActualizar(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-gray-900"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={enviandoActualizacion}
                      className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {enviandoActualizacion ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Enviando...
                        </>
                      ) : (
                        <>Guardar información</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Información adicional */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">ID de incidencia</h4>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono">{incidencia.id}</p>
                </div>
                
                {incidencia.fecha_actualizacion && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Última actualización</h4>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatearFecha(incidencia.fecha_actualizacion)}</p>
                  </div>
                )}
                
                {incidencia.reserva_id && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Reserva relacionada</h4>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                      <Link 
                        href={`/dashboard/cliente/reservas/${incidencia.reserva_id}`}
                        className="text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        Ver reserva
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DashboardContainer>
      </div>
      
      {/* Modal de confirmación de cierre */}
      {modalConfirmacion && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cerrar incidencia</h3>
              <button 
                onClick={() => setModalConfirmacion(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <XCircleIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                ¿Estás seguro de que deseas cerrar esta incidencia? Una vez cerrada, ya no podrás añadir más información ni reabrirla.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setModalConfirmacion(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCerrarIncidencia}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <XCircleIcon className="h-4 w-4 mr-1.5" />
                  Confirmar cierre
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </RoleGuard>
  );
} 