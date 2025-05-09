"use client";

import { FC } from "react";
import { ListadoEspacios } from "@/components/features/explorar/ListadoEspacios";
import { ViewMode } from "@/lib/viewPreference";
import { FiltrosEspacios } from "@/types/espacio";

interface DashboardListadoEspaciosProps {
  viewMode: ViewMode;
  filtros: FiltrosEspacios;
  onPageChange: (newPage: number) => void;
}

export const DashboardListadoEspacios: FC<DashboardListadoEspaciosProps> = (props) => {
  // Función para transformar las URLs de los espacios
  const transformUrl = (url: string): string => {
    // Si la URL comienza con /explorar/espacios/, cambiamos a la ruta del dashboard
    if (url.startsWith('/explorar/espacios/')) {
      const espacioId = url.split('/').pop();
      return `/dashboard/cliente/explorar/espacios/${espacioId}`;
    }
    return url;
  };

  return (
    <ListadoEspacios 
      {...props} 
      transformUrl={transformUrl}
    />
  );
}; 