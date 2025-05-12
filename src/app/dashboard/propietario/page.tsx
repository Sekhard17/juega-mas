'use client';

import { useState, useEffect } from 'react';
import RoleGuard from '@/components/dashboard/shared/RoleGuard';
import { useAuth } from '@/providers/AuthProvider';
import { API_ROUTES } from '@/lib/apiConfig';
import { EspacioDeportivo } from '@/types/espacio';
import { toast } from 'sonner';
import { 
  EstadisticaCard, 
  SelectorNegocio, 
  SinEspacios, 
  CabeceraBienvenida 
} from '@/components/dashboard/propietario';
import { Estadisticas } from '@/components/dashboard/propietario/types';

export default function PropietarioDashboardPage() {
  const { user } = useAuth();
  const [espacios, setEspacios] = useState<EspacioDeportivo[]>([]);
  const [espacioSeleccionado, setEspacioSeleccionado] = useState<string>('');
  const [cargando, setCargando] = useState<boolean>(true);
  const [estadisticas, setEstadisticas] = useState<Estadisticas>({
    reservas_hoy: 0,
    ganancias_dia: 0,
    cancha_popular: 'No disponible',
    horario_popular: 'No disponible',
  });

  // Cargar espacios del propietario
  useEffect(() => {
    const obtenerEspacios = async () => {
      try {
        setCargando(true);
        const respuesta = await fetch(API_ROUTES.ESPACIOS.LIST);
        
        if (!respuesta.ok) {
          throw new Error('Error al cargar los espacios');
        }
        
        const data = await respuesta.json();
        // Filtrar solo espacios del propietario actual
        const espaciosPropietario = data.filter((espacio: EspacioDeportivo) => 
          espacio.propietario_id === user?.id
        );
        
        setEspacios(espaciosPropietario);
        
        // Seleccionar el primer espacio por defecto si existe
        if (espaciosPropietario.length > 0) {
          setEspacioSeleccionado(espaciosPropietario[0].id.toString());
          await cargarEstadisticas(espaciosPropietario[0].id);
        }
      } catch (error) {
        console.error('Error al cargar espacios:', error);
        toast.error('No se pudieron cargar tus espacios deportivos');
      } finally {
        setCargando(false);
      }
    };

    if (user?.id) {
      obtenerEspacios();
    }
  }, [user?.id]);

  // Cargar estadísticas del espacio seleccionado
  const cargarEstadisticas = async (espacioId: number) => {
    try {
      setCargando(true);
      
      // Hacer llamada a la API para obtener estadísticas reales
      const respuesta = await fetch(API_ROUTES.ESPACIOS.ESTADISTICAS(espacioId));
      
      if (!respuesta.ok) {
        throw new Error('Error al cargar estadísticas');
      }
      
      const data = await respuesta.json();
      
      // Asegurarse de que los datos son válidos
      setEstadisticas({
        reservas_hoy: data?.reservas_hoy || 0,
        ganancias_dia: data?.ganancias_dia || 0,
        cancha_popular: data?.cancha_popular || 'No disponible',
        horario_popular: data?.horario_popular || 'No disponible',
      });
      
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      toast.error('No se pudieron cargar las estadísticas');
      
      // Fallback a datos simulados solo durante desarrollo
      if (process.env.NODE_ENV === 'development') {
        setEstadisticas({
          reservas_hoy: Math.floor(Math.random() * 10) + 1,
          ganancias_dia: Math.floor(Math.random() * 50000) + 5000,
          cancha_popular: espacios.find(e => e.id === espacioId)?.nombre || 'Cancha Principal',
          horario_popular: ['18:00', '19:00', '20:00'][Math.floor(Math.random() * 3)],
        });
      }
    } finally {
      setCargando(false);
    }
  };

  const handleCambioEspacio = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevoId = event.target.value;
    setEspacioSeleccionado(nuevoId);
    cargarEstadisticas(Number(nuevoId));
  };

  return (
    <RoleGuard allowedRoles={['propietario', 'admin']}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-0 pl-1">
        <div className="flex flex-col gap-6">
          {/* Cabecera y Bienvenida */}
          <CabeceraBienvenida user={user} />

          {/* Selector de Espacios */}
          <SelectorNegocio 
            espacios={espacios}
            espacioSeleccionado={espacioSeleccionado}
            onChange={handleCambioEspacio}
            cargando={cargando}
          />

          {/* Tarjetas de Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Reservas Hoy */}
            <EstadisticaCard 
              titulo="Reservas Hoy"
              color="blue"
              cargando={cargando}
              icono={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            >
              <div className="flex items-baseline">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{estadisticas.reservas_hoy}</h2>
                <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">reservas</span>
              </div>
            </EstadisticaCard>

            {/* Ganancias del Día */}
            <EstadisticaCard
              titulo="Ganancias del Día"
              color="green"
              cargando={cargando}
              icono={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            >
              <div className="flex items-baseline">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(estadisticas.ganancias_dia || 0)}
                </h2>
              </div>
            </EstadisticaCard>

            {/* Cancha Más Reservada */}
            <EstadisticaCard
              titulo="Cancha Más Reservada"
              color="purple"
              cargando={cargando}
              icono={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                </svg>
              }
            >
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                  {estadisticas.cancha_popular || 'No disponible'}
                </h2>
              </div>
            </EstadisticaCard>

            {/* Horario Más Reservado */}
            <EstadisticaCard
              titulo="Horario Más Reservado"
              color="amber"
              cargando={cargando}
              icono={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            >
              <div className="flex items-baseline">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {estadisticas.horario_popular || 'No disponible'}
                </h2>
                {estadisticas.horario_popular && (
                  <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">hrs</span>
                )}
              </div>
            </EstadisticaCard>
          </div>

          {/* Mensaje si no hay espacios */}
          {espacios.length === 0 && !cargando && <SinEspacios />}
        </div>
      </div>
    </RoleGuard>
  );
} 