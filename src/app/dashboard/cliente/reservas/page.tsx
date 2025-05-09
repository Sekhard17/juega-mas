'use client';

import { useState, useEffect } from 'react';
import { reservasModel } from '@/models/reservasModel';
import { DashboardContainer } from '@/components/dashboard';
import { useAuth } from '@/providers/AuthProvider';
import { Reserva, EstadoReserva, formatearFechaReserva, formatearHora, getColorEstadoReserva } from '@/types/reserva';
import Link from 'next/link';
import { CalendarDaysIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { RoleGuard } from '@/components/dashboard';

// Componente de filtro
const FiltroReservas = ({ 
  filtroActual, 
  setFiltro 
}: { 
  filtroActual: EstadoReserva | 'todas', 
  setFiltro: (filtro: EstadoReserva | 'todas') => void 
}) => {
  const opciones: { valor: EstadoReserva | 'todas', etiqueta: string }[] = [
    { valor: 'todas', etiqueta: 'Todas' },
    { valor: 'pendiente', etiqueta: 'Pendientes' },
    { valor: 'confirmada', etiqueta: 'Confirmadas' },
    { valor: 'completada', etiqueta: 'Completadas' },
    { valor: 'cancelada', etiqueta: 'Canceladas' }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {opciones.map(opcion => (
        <button
          key={opcion.valor}
          onClick={() => setFiltro(opcion.valor)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
            ${filtroActual === opcion.valor 
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' 
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
        >
          {opcion.etiqueta}
        </button>
      ))}
    </div>
  );
};

// Componente de tarjeta de reserva
const TarjetaReserva = ({ reserva }: { reserva: Reserva }) => {
  const colores = getColorEstadoReserva(reserva.estado);
  
  // Formatear fecha y hora en formatos legibles
  const fechaFormateada = formatearFechaReserva(reserva.fecha);
  const horaInicio = formatearHora(reserva.hora_inicio);
  const horaFin = formatearHora(reserva.hora_fin);
  
  // Extraer el mes y día para la vista de calendario
  const fecha = new Date(reserva.fecha);
  const mes = fecha.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase();
  const dia = fecha.getDate();

  return (
    <Link 
      href={`/dashboard/cliente/reservas/${reserva.id}`}
      className="block group"
    >
      <div 
        className="relative bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-5 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition-all duration-200 ease-in-out"
        role="article"
        aria-label={`Reserva para ${reserva.espacio_nombre}`}
      >
        <div className="flex items-start gap-4">
          {/* Calendario con fecha */}
          <div className="flex-shrink-0 w-16 text-center">
            <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-lg overflow-hidden">
              <div className="bg-emerald-500 dark:bg-emerald-600 py-1">
                <span className="text-xs font-bold text-white uppercase">
                  {mes}
                </span>
              </div>
              <div className="py-2 px-1">
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {dia}
                </span>
              </div>
            </div>
          </div>

          {/* Información principal */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <CalendarDaysIcon className="h-4 w-4 text-emerald-500" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {reserva.espacio_nombre}
              </h3>
            </div>

            <div className="space-y-2">
              {/* Detalles adicionales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                  <ClockIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{horaInicio} - {horaFin}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                  <MapPinIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm truncate">{reserva.espacio_ciudad}</span>
                </div>
              </div>

              {/* Información de precio y código */}
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ${new Intl.NumberFormat('es-CL').format(reserva.precio_total)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Código: {reserva.codigo_reserva}
                </span>
              </div>

              {/* Estado */}
              <div className="flex items-center mt-1">
                <div className={`
                  inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                  ${colores.bg} ${colores.text} ${colores.dark}
                `}>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    ? 'Confirmada' 
                    : reserva.estado === 'pendiente'
                    ? 'Pendiente'
                    : reserva.estado === 'cancelada'
                    ? 'Cancelada'
                    : 'Completada'
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Flecha de acción */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="p-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Vista de estado vacío
const EstadoVacio = ({ filtro }: { filtro: EstadoReserva | 'todas' }) => {
  let mensaje = 'No tienes reservas registradas';
  let submensaje = 'Explora nuestra selección de espacios deportivos y realiza tu primera reserva.';
  
  if (filtro !== 'todas') {
    mensaje = `No tienes reservas ${filtro === 'pendiente' ? 'pendientes' : 
      filtro === 'confirmada' ? 'confirmadas' : 
      filtro === 'cancelada' ? 'canceladas' : 'completadas'}`;
    submensaje = 'Ajusta los filtros para ver otras reservas o realiza una nueva reserva.';
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="h-24 w-24 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
        <CalendarDaysIcon className="w-12 h-12 text-emerald-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{mensaje}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6 max-w-sm">
        {submensaje}
      </p>
      <Link 
        href="/dashboard/cliente/explorar" 
        className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-gray-900"
      >
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Explorar espacios disponibles
      </Link>
    </div>
  );
};

export default function ReservasClientePage() {
  const { user } = useAuth();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [filtro, setFiltro] = useState<EstadoReserva | 'todas'>('todas');
  const [cargando, setCargando] = useState(true);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const porPagina = 10;

  // Actualizar el título de forma dinámica en el cliente
  useEffect(() => {
    document.title = 'Mis Reservas | JuegaMás';
  }, []);

  // Cargar reservas cuando cambia el filtro o la página
  useEffect(() => {
    const cargarReservas = async () => {
      if (!user) return;
      
      setCargando(true);
      try {
        const filtros = {
          estado: filtro !== 'todas' ? filtro : undefined,
          page: pagina,
          per_page: porPagina
        };
        
        const resultado = await reservasModel.listarReservasUsuario(filtros, user.id.toString());
        setReservas(resultado.reservas);
        setTotal(resultado.total);
      } catch (error) {
        console.error('Error al cargar reservas:', error);
      } finally {
        setCargando(false);
      }
    };
    
    cargarReservas();
  }, [filtro, pagina, user]);

  // Función para cambiar de página
  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina > 0 && nuevaPagina <= Math.ceil(total / porPagina)) {
      setPagina(nuevaPagina);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <RoleGuard allowedRoles={['cliente', 'usuario']}>
      <div className="space-y-6">
        <DashboardContainer 
          title="Mis Reservas" 
          description="Gestiona todas tus reservas de espacios deportivos"
          actions={
            <Link 
              href="/dashboard/cliente/explorar" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Nueva reserva
            </Link>
          }
        >
          <div>
            {/* Filtros */}
            <FiltroReservas filtroActual={filtro} setFiltro={setFiltro} />
            
            {/* Estado de cargando */}
            {cargando && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
              </div>
            )}
            
            {/* Listado de reservas */}
            {!cargando && (
              <>
                {reservas.length > 0 ? (
                  <div className="space-y-4">
                    {reservas.map((reserva) => (
                      <TarjetaReserva key={reserva.id} reserva={reserva} />
                    ))}
                    
                    {/* Paginación */}
                    {total > porPagina && (
                      <div className="flex justify-center items-center space-x-2 mt-8">
                        <button 
                          onClick={() => cambiarPagina(pagina - 1)}
                          disabled={pagina === 1}
                          className="p-2 rounded-md border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Página {pagina} de {Math.ceil(total / porPagina)}
                        </span>
                        
                        <button 
                          onClick={() => cambiarPagina(pagina + 1)}
                          disabled={pagina >= Math.ceil(total / porPagina)}
                          className="p-2 rounded-md border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <EstadoVacio filtro={filtro} />
                )}
              </>
            )}
          </div>
        </DashboardContainer>
      </div>
    </RoleGuard>
  );
} 