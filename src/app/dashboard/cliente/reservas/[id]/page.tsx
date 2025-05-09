'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { reservasModel } from '@/models/reservasModel';
import { Reserva, formatearFechaReserva, formatearHora, getColorEstadoReserva } from '@/types/reserva';
import { DashboardContainer } from '@/components/dashboard';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  CalendarDaysIcon, 
  ClockIcon, 
  MapPinIcon, 
  UserIcon, 
  PhoneIcon, 
  BuildingLibraryIcon,
  ReceiptRefundIcon,
  CreditCardIcon,
  XCircleIcon,
  CheckCircleIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { RoleGuard } from '@/components/dashboard';
import Image from 'next/image';

export default function DetalleReservaPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalCancelacion, setModalCancelacion] = useState(false);
  const [motivoCancelacion, setMotivoCancelacion] = useState('');
  const [enviandoCancelacion, setEnviandoCancelacion] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  // Actualizar el título de forma dinámica
  useEffect(() => {
    document.title = reserva 
      ? `Reserva ${reserva.codigo_reserva} | JuegaMás` 
      : 'Detalle de Reserva | JuegaMás';
  }, [reserva]);

  // Cargar detalle de la reserva
  useEffect(() => {
    const cargarReserva = async () => {
      setCargando(true);
      setError(null);
      try {
        const detalleReserva = await reservasModel.obtenerReserva(params.id);
        if (!detalleReserva) {
          setError('No se encontró la reserva solicitada');
        } else {
          setReserva(detalleReserva);
        }
      } catch (err) {
        console.error('Error al cargar detalle de reserva:', err);
        setError('Ocurrió un error al cargar los datos de la reserva');
      } finally {
        setCargando(false);
      }
    };
    
    cargarReserva();
  }, [params.id]);

  // Manejar cancelación de reserva
  const handleCancelarReserva = async () => {
    if (motivoCancelacion.trim().length < 10) {
      return; // Validación simple
    }
    
    setEnviandoCancelacion(true);
    try {
      const resultado = await reservasModel.cancelarReserva(params.id, motivoCancelacion);
      if (resultado.success) {
        setModalCancelacion(false);
        setMensajeExito('La reserva ha sido cancelada correctamente');
        // Actualizar la reserva mostrada
        const detalleReserva = await reservasModel.obtenerReserva(params.id);
        if (detalleReserva) {
          setReserva(detalleReserva);
        }
      } else {
        setError(resultado.message);
      }
    } catch (err) {
      console.error('Error al cancelar reserva:', err);
      setError('Ocurrió un error al procesar la cancelación');
    } finally {
      setEnviandoCancelacion(false);
    }
  };

  // Formatear la fecha para mostrar
  const formatearFecha = (fecha: string | undefined): string => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Verificar si la reserva puede ser cancelada
  const puedeSerCancelada = (): boolean => {
    if (!reserva) return false;
    return ['pendiente', 'confirmada'].includes(reserva.estado);
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
        <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error al cargar la reserva</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
        <Link 
          href="/dashboard/cliente/reservas" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" /> Volver a mis reservas
        </Link>
      </div>
    );
  }

  if (!reserva) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No se encontró la reserva</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">La reserva que buscas no existe o no tienes acceso a ella.</p>
        <Link 
          href="/dashboard/cliente/reservas" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" /> Volver a mis reservas
        </Link>
      </div>
    );
  }

  // Formateamos los valores para mostrar
  const colores = getColorEstadoReserva(reserva.estado);
  const fechaFormateada = formatearFechaReserva(reserva.fecha);
  const horaInicio = formatearHora(reserva.hora_inicio);
  const horaFin = formatearHora(reserva.hora_fin);
  const fechaReservaCompleta = formatearFecha(reserva.fecha);
  const fechaCreacion = formatearFecha(reserva.created_at);

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
            href="/dashboard/cliente/reservas"
            className="inline-flex items-center mr-4 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Volver a mis reservas
          </Link>
          <div className="h-6 border-l border-gray-300 dark:border-gray-700 mx-2"></div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Código de reserva: <span className="font-mono font-medium text-gray-800 dark:text-gray-200">{reserva.codigo_reserva}</span>
          </span>
        </div>
        
        {/* Contenedor principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información principal - 2/3 del ancho */}
          <div className="lg:col-span-2 space-y-6">
            <DashboardContainer
              title="Detalle de la Reserva"
              description={`Estado: ${reserva.estado === 'confirmada' 
                ? 'Confirmada' 
                : reserva.estado === 'pendiente'
                ? 'Pendiente'
                : reserva.estado === 'cancelada'
                ? 'Cancelada'
                : 'Completada'}`}
              actions={
                puedeSerCancelada() ? (
                  <button
                    onClick={() => setModalCancelacion(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <XCircleIcon className="h-4 w-4 mr-1.5" />
                    Cancelar reserva
                  </button>
                ) : null
              }
            >
              <div className="space-y-6">
                {/* Estado de la reserva */}
                <div className="flex items-center">
                  <div className={`
                    inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
                    ${colores.bg} ${colores.text} ${colores.dark}
                  `}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {reserva.estado === 'confirmada' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : reserva.estado === 'pendiente' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : reserva.estado === 'cancelada' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      )}
                    </svg>
                    {reserva.estado === 'confirmada' 
                      ? 'Reserva Confirmada' 
                      : reserva.estado === 'pendiente'
                      ? 'Reserva Pendiente'
                      : reserva.estado === 'cancelada'
                      ? 'Reserva Cancelada'
                      : 'Reserva Completada'
                    }
                  </div>
                </div>

                {/* Información del espacio */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Información del Espacio</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del espacio</h4>
                        <p className="text-gray-900 dark:text-white font-semibold">{reserva.espacio_nombre}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de espacio</h4>
                        <p className="text-gray-900 dark:text-white">{reserva.espacio_tipo}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dirección</h4>
                        <p className="text-gray-900 dark:text-white">{reserva.espacio_direccion}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ciudad</h4>
                        <p className="text-gray-900 dark:text-white">{reserva.espacio_ciudad}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Propietario</h4>
                        <p className="text-gray-900 dark:text-white">{reserva.propietario_nombre}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contacto del propietario</h4>
                        <p className="text-gray-900 dark:text-white">{reserva.propietario_email}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Detalles de la reserva */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Detalles de la Reserva</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <CalendarDaysIcon className="w-5 h-5 text-emerald-500" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Fecha</h4>
                          <p className="text-gray-900 dark:text-white">{fechaReservaCompleta}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-5 h-5 text-emerald-500" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Horario</h4>
                          <p className="text-gray-900 dark:text-white">{horaInicio} - {horaFin}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <BanknotesIcon className="w-5 h-5 text-emerald-500" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Precio total</h4>
                          <p className="text-gray-900 dark:text-white font-semibold">
                            ${new Intl.NumberFormat('es-CL').format(reserva.precio_total)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <CreditCardIcon className="w-5 h-5 text-emerald-500" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Método de pago</h4>
                          <p className="text-gray-900 dark:text-white">
                            {reserva.metodo_pago || 'No especificado'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {reserva.notas && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notas adicionales</h4>
                      <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900/30 p-3 rounded-lg">
                        {reserva.notas}
                      </p>
                    </div>
                  )}
                  
                  {reserva.estado === 'cancelada' && reserva.motivo_cancelacion && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg">
                      <h4 className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">Motivo de cancelación</h4>
                      <p className="text-red-800 dark:text-red-200">{reserva.motivo_cancelacion}</p>
                    </div>
                  )}
                </div>
              </div>
            </DashboardContainer>
          </div>
          
          {/* Panel lateral - 1/3 del ancho */}
          <div className="space-y-6">
            {/* QR de la reserva */}
            <DashboardContainer
              title="Código QR"
              description="Muestra este código para acceder"
            >
              <div className="flex flex-col items-center p-4">
                <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-3">
                  <Image 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${reserva.codigo_reserva}`}
                    alt="Código QR de la reserva"
                    width={200}
                    height={200}
                    className="rounded"
                  />
                </div>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Código: <span className="font-mono font-medium text-gray-900 dark:text-white">{reserva.codigo_reserva}</span>
                </p>
              </div>
            </DashboardContainer>
            
            {/* Información adicional */}
            <DashboardContainer
              title="Información adicional"
            >
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de creación</h4>
                  <p className="text-gray-900 dark:text-white">{fechaCreacion}</p>
                </div>
                
                {reserva.updated_at && reserva.updated_at !== reserva.created_at && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Última actualización</h4>
                    <p className="text-gray-900 dark:text-white">{formatearFecha(reserva.updated_at)}</p>
                  </div>
                )}
                
                {puedeSerCancelada() && (
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">¿Necesitas cancelar?</h4>
                    <button
                      onClick={() => setModalCancelacion(true)}
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <XCircleIcon className="h-4 w-4 mr-1.5" />
                      Solicitar cancelación
                    </button>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Ten en cuenta que las cancelaciones pueden estar sujetas a las políticas del espacio.
                    </p>
                  </div>
                )}
              </div>
            </DashboardContainer>
          </div>
        </div>
      </div>
      
      {/* Modal de cancelación */}
      {modalCancelacion && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cancelar reserva</h3>
              <button 
                onClick={() => setModalCancelacion(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <XCircleIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                ¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer.
              </p>
              
              <div className="mb-4">
                <label htmlFor="motivoCancelacion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Motivo de la cancelación
                </label>
                <textarea
                  id="motivoCancelacion"
                  rows={3}
                  value={motivoCancelacion}
                  onChange={(e) => setMotivoCancelacion(e.target.value)}
                  placeholder="Por favor, indícanos el motivo de la cancelación..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                  required
                />
                {motivoCancelacion.trim().length < 10 && (
                  <p className="mt-1 text-xs text-red-500">
                    Por favor, introduce un motivo de al menos 10 caracteres.
                  </p>
                )}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setModalCancelacion(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCancelarReserva}
                  disabled={motivoCancelacion.trim().length < 10 || enviandoCancelacion}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {enviandoCancelacion ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="h-4 w-4 mr-1.5" />
                      Confirmar cancelación
                    </>
                  )}
                </button>
              </div>
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </RoleGuard>
  );
} 