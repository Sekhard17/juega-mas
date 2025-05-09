'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import { reservasModel } from '@/models/reservasModel';
import { Reserva, formatearFechaReserva, formatearHora } from '@/types/reserva';

export default function ClienteDashboardPage() {
  const { user } = useAuth();
  const [proximasReservas, setProximasReservas] = useState<Reserva[]>([]);
  const [cargandoReservas, setCargandoReservas] = useState(true);

  // Actualizar el título de forma dinámica en el cliente
  useEffect(() => {
    document.title = 'Dashboard de Cliente | JuegaMás';
  }, []);

  // Cargar próximas reservas del usuario
  useEffect(() => {
    const cargarProximasReservas = async () => {
      if (!user || !user.id) {
        console.log('No hay usuario autenticado o ID válido en el contexto');
        setCargandoReservas(false);
        return;
      }

      setCargandoReservas(true);
      try {
        const reservas = await reservasModel.obtenerProximasReservas(3, user.id.toString());
        setProximasReservas(reservas);
      } catch (error) {
        console.error('Error al cargar próximas reservas:', error);
        // Mostrar mensaje de error al usuario
        // toast.error('No se pudieron cargar tus próximas reservas');
      } finally {
        setCargandoReservas(false);
      }
    };
    
    if (user && user.id) {
      cargarProximasReservas();
    }
  }, [user]);

  // Datos de ejemplo para los espacios recomendados
  const espaciosRecomendados = [
    { 
      id: 1, 
      nombre: 'Cancha de Básquet Profesional', 
      ubicacion: 'Providencia, Santiago', 
      precio: 35000, 
      rating: 4.8,
      imagen: '/espacios/basquet-premium.jpeg',
      categoria: 'Básquet'
    },
    { 
      id: 2, 
      nombre: 'Club de Pádel Las Condes', 
      ubicacion: 'Las Condes, Santiago', 
      precio: 30000, 
      rating: 4.7,
      imagen: '/espacios/padel-premium.jpeg',
      categoria: 'Pádel'
    },
    { 
      id: 3, 
      nombre: 'Complejo de Fútbol 7 La Pintana', 
      ubicacion: 'La Pintana, Santiago', 
      precio: 45000, 
      rating: 4.9,
      imagen: '/espacios/futbol-7-premium.jpg',
      categoria: 'Fútbol 7'
    },
    { 
      id: 4, 
      nombre: 'Cancha de Fútbol 5 Ñuñoa', 
      ubicacion: 'Ñuñoa, Santiago', 
      precio: 28000, 
      rating: 4.8,
      imagen: '/espacios/futbol-5-premium.jpg',
      categoria: 'Fútbol 5'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Saludo personalizado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-emerald-100/50 dark:bg-emerald-900/20">
            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-medium text-gray-900 dark:text-white">¡Bienvenido, {user?.nombre || 'Cliente'}!</h1>
              <div className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">¿Listo para encontrar tu próximo espacio deportivo?</p>
          </div>
        </div>
        <Link
          href="/dashboard/cliente/explorar"
          className="flex items-center px-3 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
        >
          Explorar espacios
          <svg className="ml-1.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>

      {/* Contenedores en grid: próximas reservas y gráfico de actividad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Próximas reservas - Ahora ocupa 2/3 del ancho en pantallas grandes */}
        <div className="lg:col-span-2 flex flex-col">
          <DashboardContainer 
            title="Tus próximas reservas" 
            description="Reservas programadas para los próximos días"
            actions={
              <Link 
                href="/dashboard/cliente/reservas" 
                className="inline-flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
              >
                Ver todas
                <svg className="ml-1.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            }
            className="h-full"
          >
            {cargandoReservas ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="h-24 w-24 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Cargando reservas...</h3>
              </div>
            ) : proximasReservas.length > 0 ? (
              <div className="space-y-4">
                {proximasReservas.map((reserva) => {
                  // Formatear fecha para la vista de calendario
                  const fecha = new Date(reserva.fecha);
                  const mes = fecha.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase();
                  const dia = fecha.getDate();
                  
                  return (
                    <Link
                      key={reserva.id}
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
                              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {reserva.espacio_nombre}
                              </h3>
                            </div>

                            <div className="space-y-2">
                              {/* Horario */}
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="text-sm font-medium">{formatearHora(reserva.hora_inicio)} - {formatearHora(reserva.hora_fin)}</span>
                                </div>
                              </div>

                              {/* Estado */}
                              <div className="flex items-center">
                                <div className={`
                                  inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                                  ${reserva.estado === 'confirmada' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                    : reserva.estado === 'pendiente'
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                    : reserva.estado === 'cancelada'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                  }
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
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="h-24 w-24 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No tienes reservas programadas</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6 max-w-sm">
                  ¡Es momento de reservar tu próximo espacio deportivo! Explora nuestra selección de canchas y espacios disponibles.
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
            )}
          </DashboardContainer>
        </div>

        {/* Gráfico de actividad deportiva */}
        <div className="lg:col-span-1 flex flex-col">
          <DashboardContainer 
            title="Tu actividad deportiva" 
            description="Horas reservadas por deporte este mes"
            className="h-full"
          >
            <div className="flex flex-col items-center justify-between h-full py-3">
              {/* Gráfico circular */}
              <div className="relative w-40 h-40 mt-2">
                {/* Segmento Fútbol 5 - 40% */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-emerald-500 opacity-85" style={{ clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 100% 60%, 50% 50%)' }}></div>
                </div>
                {/* Segmento Básquet - 25% */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-blue-500 opacity-85" style={{ clipPath: 'polygon(50% 50%, 100% 60%, 100% 100%, 65% 100%, 50% 50%)' }}></div>
                </div>
                {/* Segmento Pádel - 20% */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-amber-500 opacity-85" style={{ clipPath: 'polygon(50% 50%, 65% 100%, 20% 100%, 0% 80%, 50% 50%)' }}></div>
                </div>
                {/* Segmento Fútbol 7 - 15% */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-purple-500 opacity-85" style={{ clipPath: 'polygon(50% 50%, 0% 80%, 0% 30%, 20% 0, 50% 0, 50% 50%)' }}></div>
                </div>
                {/* Círculo central */}
                <div className="absolute inset-0 m-auto w-14 h-14 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">12 horas</span>
                </div>
              </div>
              
              {/* Leyenda en 2x2 */}
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 w-full max-w-xs mt-4">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-emerald-500 rounded-sm mr-2"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Fútbol 5 (40%)</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-blue-500 rounded-sm mr-2"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Básquet (25%)</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-amber-500 rounded-sm mr-2"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Pádel (20%)</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-purple-500 rounded-sm mr-2"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Fútbol 7 (15%)</span>
                </div>
              </div>
              
              {/* Botón de acción */}
              <div className="mt-4 w-full flex justify-center">
                <Link 
                  href="/dashboard/cliente/estadisticas" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-emerald-700 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-gray-900"
                >
                  Ver estadísticas completas
                </Link>
              </div>
            </div>
          </DashboardContainer>
        </div>
      </div>

      {/* Espacios recomendados - Layout horizontal */}
      <DashboardContainer 
        title="Espacios recomendados" 
        description="Basados en tus preferencias y reservas anteriores"
        actions={
          <Link 
            href="/dashboard/cliente/explorar" 
            className="inline-flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
          >
            Ver más
            <svg className="ml-1.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        }
      >
        <div className="relative">
          <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {espaciosRecomendados.map((espacio) => (
              <Link
                key={espacio.id}
                href={`/dashboard/cliente/espacios/${espacio.id}`}
                className="group flex-shrink-0 w-72"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-2">
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <img
                    src={espacio.imagen}
                    alt={espacio.nombre}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/90 text-gray-800 dark:bg-gray-900/90 dark:text-gray-200">
                      {espacio.categoria}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {espacio.nombre}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1">{espacio.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {espacio.ubicacion}
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    ${espacio.precio.toLocaleString()} <span className="text-gray-500 dark:text-gray-400 font-normal">por hora</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </DashboardContainer>

      {/* Centro de Ayuda */}
      <DashboardContainer
        title="¿Necesitas ayuda?"
        description="Si tienes algún problema o consulta, estamos aquí para ayudarte"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors duration-200">
            <Link href="/dashboard/cliente/reportar-problema" className="block group">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Reportar un problema
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Si encuentras algún problema con una reserva, un espacio deportivo o necesitas asistencia.
                  </p>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors duration-200">
            <Link href="/preguntas-frecuentes" className="block group">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Preguntas frecuentes
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Consulta nuestras respuestas a las preguntas más comunes sobre reservas y espacios.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </DashboardContainer>
    </div>
  );
} 