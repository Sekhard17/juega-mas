export type TipoRecinto = 'cancha' | 'gimnasio' | 'piscina' | 'pista' | 'complejo';

export interface ServicioRecinto {
  id: string;
  nombre: string;
  icono: string; // Nombre del icono para usar desde heroicons
}

export interface RecintoCategoriaDeporte {
  id: string;
  nombre: string;
}

export interface RecintoDeportivo {
  id: string;
  nombre: string;
  descripcion: string;
  imagenes: string[];
  imagen_principal: string;
  ubicacion: {
    direccion: string;
    comuna: string;
    region: string;
    coordenadas?: {
      lat: number;
      lng: number;
    }
  };
  tipo: TipoRecinto;
  categorias: RecintoCategoriaDeporte[];
  servicios: ServicioRecinto[];
  precios: {
    hora: number;
    media_jornada?: number;
    jornada_completa?: number;
  };
  capacidad: {
    min: number;
    max: number;
  };
  horario_apertura: string;
  horario_cierre: string;
  calificacion: number;
  total_calificaciones: number;
  disponible: boolean;
  destacado?: boolean;
}

export interface FiltrosRecinto {
  busqueda: string;
  ubicacion: string;
  tipo: string;
  categoria: string;
  precio_min?: number;
  precio_max?: number;
  capacidad_min?: number;
  servicios: string[];
  ordenar_por: 'precio_asc' | 'precio_desc' | 'calificacion' | 'popularidad';
} 