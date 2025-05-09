"use client";

import { useEffect, useState } from "react";
import { 
  DashboardExplorarHeader,
  RecomendacionesPersonalizadas,
  DashboardListadoEspacios
} from "@/components/features/dashboard/explorar";
import { FiltrosEspacios } from "@/components/features/explorar/FiltrosEspacios";
import { ViewToggle } from "@/components/features/explorar/ViewToggle";
import { getViewMode, ViewMode } from "@/lib/viewPreference";
import { FiltrosEspacios as FiltrosType } from "@/types/espacio";
import { useAuth } from "@/providers/AuthProvider";

export default function DashboardExplorarPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const { user } = useAuth();
  const [filtros, setFiltros] = useState<FiltrosType>({
    busqueda: "",
    page: 1,
    per_page: 12,
  });
  
  // Cargar preferencia de vista al iniciar
  useEffect(() => {
    setViewMode(getViewMode());
  }, []);
  
  // Función para manejar cambios en los filtros
  const handleFiltrosChange = (nuevosFiltros: Partial<FiltrosType>) => {
    setFiltros((prev) => ({
      ...prev,
      ...nuevosFiltros,
      // Resetear a la primera página cuando cambian los filtros (excepto si el cambio es de página)
      page: "page" in nuevosFiltros ? nuevosFiltros.page || 1 : 1,
    }));
  };
  
  // Función para manejar cambio de página
  const handlePageChange = (newPage: number) => {
    handleFiltrosChange({ page: newPage });
  };

  // Función para manejar búsqueda en el header
  const handleHeaderSearch = (query: string) => {
    handleFiltrosChange({ busqueda: query });
  };
  
  return (
    <div className="w-full">
      {/* Encabezado específico para la experiencia de dashboard */}
      <DashboardExplorarHeader 
        onSearch={handleHeaderSearch}
        nombreUsuario={user?.nombre}
      />
      
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6 border border-zinc-200 dark:border-zinc-700">
        {/* Sección de recomendaciones personalizada */}
        <RecomendacionesPersonalizadas />
        
        <div className="flex flex-col-reverse md:flex-row gap-6">
          {/* Panel de filtros lateral (en desktop) */}
          <div className="md:w-1/4 lg:w-1/5">
            <FiltrosEspacios
              filtros={filtros}
              onChange={handleFiltrosChange}
            />
          </div>
          
          {/* Contenido principal */}
          <div className="flex-1">
            {/* Barra de herramientas superior */}
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
              <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">
                Recintos disponibles
              </h2>
              
              <ViewToggle
                viewMode={viewMode}
                onChange={setViewMode}
              />
            </div>
            
            {/* Listado de recintos adaptado para dashboard */}
            <DashboardListadoEspacios
              viewMode={viewMode}
              filtros={filtros}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 