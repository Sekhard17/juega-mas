"use client";

import { FC } from "react";
import Link from "next/link";

export interface Recomendacion {
  id: string;
  tipo: "favorito" | "tendencia" | "nuevo";
  titulo: string;
  descripcion: string;
}

interface RecomendacionesPersonalizadasProps {
  recomendaciones?: Recomendacion[];
}

export const RecomendacionesPersonalizadas: FC<RecomendacionesPersonalizadasProps> = ({ 
  recomendaciones = defaultRecomendaciones 
}) => {
  return (
    <div className="mb-8 p-4 bg-primary-50/50 dark:bg-primary-900/20 rounded-lg border border-primary-100 dark:border-primary-800">
      <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-2">
        Recomendado para ti
      </h3>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3">
        Basado en tus actividades recientes y preferencias
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {recomendaciones.map((recomendacion) => (
          <Link 
            href={`/dashboard/cliente/explorar?tipo=${recomendacion.titulo.toLowerCase()}`} 
            key={recomendacion.id}
          >
            <div className="bg-white dark:bg-zinc-700 p-3 rounded-lg shadow-sm hover:shadow-md transition-all border border-zinc-200 dark:border-zinc-600">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getBadgeStyles(recomendacion.tipo)}`}>
                {getBadgeText(recomendacion.tipo)}
              </span>
              <h4 className="font-medium mt-2">{recomendacion.titulo}</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{recomendacion.descripcion}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Utilidades para los estilos de las etiquetas
const getBadgeStyles = (tipo: Recomendacion['tipo']) => {
  switch (tipo) {
    case 'favorito':
      return 'text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/40';
    case 'tendencia':
      return 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40';
    case 'nuevo':
      return 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40';
    default:
      return 'text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/60';
  }
};

const getBadgeText = (tipo: Recomendacion['tipo']) => {
  switch (tipo) {
    case 'favorito':
      return 'Favorito';
    case 'tendencia':
      return 'Tendencia';
    case 'nuevo':
      return 'Nuevo';
    default:
      return 'Recomendado';
  }
};

// Recomendaciones por defecto para mostrar si no se proporcionan
const defaultRecomendaciones: Recomendacion[] = [
  {
    id: '1',
    tipo: 'favorito',
    titulo: 'Canchas de Fútbol',
    descripcion: 'Canchas disponibles cercanas'
  },
  {
    id: '2',
    tipo: 'tendencia',
    titulo: 'Canchas de Padel',
    descripcion: 'Prueba este deporte popular'
  },
  {
    id: '3',
    tipo: 'nuevo',
    titulo: 'Gimnasios',
    descripcion: 'Espacios para entrenar'
  }
]; 