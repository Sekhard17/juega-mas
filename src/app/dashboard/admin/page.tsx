'use client';

import RoleGuard from '@/components/dashboard/shared/RoleGuard';
import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { CabeceraBienvenidaAdmin, EstadisticaCard, EstadisticaSkeleton } from '@/components/dashboard/admin';
import { UltimosUsuariosTable } from '@/components/dashboard';
import { API_ROUTES } from '@/lib/apiConfig';
import { AdminEstadisticas } from '@/models/adminModel';
import { toast } from 'sonner';
import GraficosContainer from '@/components/dashboard/admin/GraficosContainer';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [cargando, setCargando] = useState(true);
  const [estadisticas, setEstadisticas] = useState<AdminEstadisticas>({
    totalClientes: 0,
    totalPropietarios: 0,
    totalRecintos: 0,
    suscripcionesActivas: 0
  });
  
  useEffect(() => {
    document.title = 'Dashboard de Administrador | JuegaMás';
    
    const cargarEstadisticas = async () => {
      try {
        setCargando(true);
        
        // Hacemos la petición directamente al endpoint usando la ruta hardcodeada
        const response = await fetch(API_ROUTES.ADMIN.ESTADISTICAS);
        
        if (!response.ok) {
          throw new Error('Error al cargar estadísticas');
        }
        
        const datos = await response.json();
        setEstadisticas(datos);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        toast.error('No se pudieron cargar las estadísticas');
      } finally {
        setCargando(false);
      }
    };
    
    cargarEstadisticas();
  }, []);
  
  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-0 pl-1">
        <div className="flex flex-col gap-6">
          {/* Cabecera y Bienvenida */}
          <CabeceraBienvenidaAdmin user={user} />
          
          {/* Cards de Estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cargando ? (
              <>
                <EstadisticaSkeleton />
                <EstadisticaSkeleton />
                <EstadisticaSkeleton />
                <EstadisticaSkeleton />
              </>
            ) : (
              <>
                {/* Total de Clientes */}
                <EstadisticaCard
                  titulo="Total de Clientes"
                  valor={estadisticas.totalClientes.toLocaleString()}
                  color="blue"
                  icono={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  }
                  tendencia={estadisticas.tendencias?.clientes}
                  descripcion="Usuarios registrados"
                />
                
                {/* Total de Propietarios */}
                <EstadisticaCard
                  titulo="Total de Propietarios"
                  valor={estadisticas.totalPropietarios.toLocaleString()}
                  color="green"
                  icono={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  }
                  tendencia={estadisticas.tendencias?.propietarios}
                  descripcion="Ofrecen espacios deportivos"
                />
                
                {/* Total de Recintos */}
                <EstadisticaCard
                  titulo="Total de Recintos"
                  valor={estadisticas.totalRecintos.toLocaleString()}
                  color="purple"
                  icono={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                  }
                  tendencia={estadisticas.tendencias?.recintos}
                  descripcion="Instalaciones disponibles"
                />
                
                {/* Suscripciones Activas */}
                <EstadisticaCard
                  titulo="Suscripciones Activas"
                  valor={estadisticas.suscripcionesActivas.toLocaleString()}
                  color="amber"
                  icono={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  }
                  tendencia={estadisticas.tendencias?.suscripciones}
                  descripcion="Planes premium vigentes"
                />
              </>
            )}
          </div>
          
          {/* Contenido adicional del dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Gráficos de estadísticas - 2/3 del ancho */}
            <div className="lg:col-span-2">
              <GraficosContainer />
            </div>
            
            {/* Tabla de últimos usuarios - Ocupa 1/3 del ancho en pantallas grandes */}
            <div className="lg:col-span-1">
              <UltimosUsuariosTable 
                titulo="Últimos usuarios registrados"
                descripcion="Usuarios que se han unido recientemente a la plataforma"
                className="h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
} 