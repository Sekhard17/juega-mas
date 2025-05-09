export type EstadoEspacio = 'activo' | 'inactivo' | 'pendiente';

export interface Caracteristica {
  id: number;
  nombre: string; // 'vestuarios', 'iluminacion', 'estacionamiento', etc.
  valor: string; // 'si/no' o valor específico
}

export interface ImagenEspacio {
  id: number;
  url: string;
  orden: number;
}

export interface HorarioDisponibilidad {
  id: number;
  dia_semana: number; // 0=domingo, 1=lunes, ..., 6=sábado
  hora_inicio: string;
  hora_fin: string;
  disponible: boolean;
  precio_especial?: number;
}

export interface EspacioDeportivo {
  id: number;
  propietario_id: number;
  nombre: string;
  tipo: string; // 'futbol', 'tenis', 'padel', 'basquet', etc.
  descripcion?: string;
  direccion: string;
  ciudad: string;
  estado?: string;
  codigo_postal?: string;
  latitud?: number;
  longitud?: number;
  precio_base: number;
  capacidad_min?: number;
  capacidad_max?: number;
  duracion_turno: number; // en minutos (60, 90, 120, etc.)
  imagen_principal?: string;
  estado_espacio: EstadoEspacio;
  created_at?: string;
  updated_at?: string;
  
  // Relaciones (opcionales porque pueden cargarse por separado)
  caracteristicas?: Caracteristica[];
  imagenes?: ImagenEspacio[];
  horarios?: HorarioDisponibilidad[];
  puntuacion_promedio?: number;
  total_resenas?: number;
}

export interface FiltrosEspacios {
  busqueda?: string;
  tipo?: string;
  ciudad?: string;
  precio_min?: number;
  precio_max?: number;
  capacidad_min?: number;
  caracteristicas?: string[];
  ordenar_por?: 'precio_asc' | 'precio_desc' | 'calificacion' | 'popularidad';
  page?: number;
  per_page?: number;
}

export interface PaginacionEspacios {
  total: number;
  pagina_actual: number;
  total_paginas: number;
  por_pagina: number;
} 