"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { API_ROUTES } from '@/lib/apiConfig';
import { espaciosModel } from '@/models/espaciosModel';
import { EspacioDeportivo, FiltrosEspacios } from '@/types/espacio';
import { toast } from 'sonner';
import { ViewMode, saveViewMode, getViewMode } from '@/lib/viewPreference';
import EspaciosHeader from '@/components/dashboard/propietario/EspaciosHeader';
import EspaciosTable from '@/components/dashboard/propietario/EspaciosTable';
import EspaciosCards from '@/components/dashboard/propietario/EspaciosCards';

export default function EspaciosPropietarioPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [espacios, setEspacios] = useState<EspacioDeportivo[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [filtros, setFiltros] = useState<FiltrosEspacios>({});

  // Cargar preferencia de vista al iniciar
  useEffect(() => {
    setViewMode(getViewMode());
  }, []);

  // Guardar preferencia cuando cambia
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    saveViewMode(mode);
  };

  // Cargar espacios deportivos
  useEffect(() => {
    const cargarEspacios = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        
        // Usar el modelo para obtener los espacios filtrados
        const resultado = await espaciosModel.listarEspacios(filtros);
        
        // Filtrar solo los espacios del propietario actual
        const espaciosPropietario = resultado.espacios.filter(
          (espacio) => espacio.propietario_id === user.id
        );
        
        setEspacios(espaciosPropietario);
      } catch (error) {
        console.error('Error:', error);
        toast.error('No se pudieron cargar tus espacios deportivos');
      } finally {
        setLoading(false);
      }
    };

    cargarEspacios();
  }, [user?.id, filtros]);

  // Manejar búsqueda
  const handleSearch = (query: string) => {
    setFiltros((prev) => ({
      ...prev,
      busqueda: query
    }));
  };

  // Manejar cambios en filtros
  const handleFilterChange = (nuevosFiltros: Partial<FiltrosEspacios>) => {
    setFiltros((prev) => ({
      ...prev,
      ...nuevosFiltros
    }));
  };

  // Manejar eliminación de espacio
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_ROUTES.ESPACIOS.DELETE}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el espacio');
      }

      // Eliminar el espacio de la lista
      setEspacios((prev) => prev.filter((espacio) => espacio.id !== id));
      toast.success('Espacio eliminado correctamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('No se pudo eliminar el espacio');
      throw error; // Re-lanzar para que el componente maneje el estado del botón
    }
  };

  // Manejar cambio de estado (activar/desactivar)
  const handleToggleEstado = async (id: number, nuevoEstado: 'activo' | 'inactivo') => {
    try {
      const response = await fetch(`${API_ROUTES.ESPACIOS.UPDATE}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado_espacio: nuevoEstado }),
      });

      if (!response.ok) {
        throw new Error(`Error al cambiar el estado del espacio: ${response.statusText}`);
      }

      // Actualizar el estado en la lista
      setEspacios((prev) => 
        prev.map((espacio) => 
          espacio.id === id 
            ? { ...espacio, estado_espacio: nuevoEstado } 
            : espacio
        )
      );
      
      toast.success(`Espacio ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'} correctamente`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('No se pudo cambiar el estado del espacio');
      throw error; // Re-lanzar para que el componente maneje el estado del botón
    }
  };

  return (
    <div className="px-2 py-2 md:px-4 md:py-3 max-w-full">
      {/* Cabecera con filtros y selector de vista */}
      <EspaciosHeader 
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        filtrosActuales={filtros}
      />
      
      {/* Mostrar espacios según el modo de vista */}
      {viewMode === 'table' ? (
        <EspaciosTable 
          espacios={espacios} 
          onDelete={handleDelete}
          onToggleEstado={handleToggleEstado}
          isLoading={loading}
        />
      ) : (
        <EspaciosCards 
          espacios={espacios} 
          onDelete={handleDelete}
          onToggleEstado={handleToggleEstado}
          isLoading={loading}
        />
      )}
    </div>
  );
} 