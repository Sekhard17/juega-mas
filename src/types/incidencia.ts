// Define los tipos de incidencias que pueden reportarse
export type TipoIncidencia = 
  | 'problema_reserva' 
  | 'problema_espacio' 
  | 'problema_pago'
  | 'problema_acceso'
  | 'sugerencia' 
  | 'otro';

// Define los estados posibles de una incidencia
export type EstadoIncidencia = 
  | 'pendiente' 
  | 'en_revision' 
  | 'resuelta' 
  | 'cerrada';

// Define la estructura de una incidencia
export interface Incidencia {
  id: string;
  usuario_id: string;
  reserva_id?: string; // Opcional, puede estar relacionada con una reserva específica
  tipo: TipoIncidencia;
  asunto: string;
  descripcion: string;
  estado: EstadoIncidencia;
  fecha_creacion: string;
  fecha_actualizacion?: string;
  respuesta?: string;
  archivos_adjuntos?: string[]; // URLs a imágenes o archivos que el usuario adjuntó
}

// Define los filtros para las consultas de incidencias
export interface FiltrosIncidencia {
  tipo?: TipoIncidencia;
  estado?: EstadoIncidencia;
  fecha_desde?: string;
  fecha_hasta?: string;
  reserva_id?: string;
  page?: number;
  per_page?: number;
}

// Interfaz para la respuesta de creación o actualización de incidencia
export interface RespuestaIncidencia {
  success: boolean;
  message: string;
  incidencia?: Incidencia;
}

// Función para obtener el color según el estado de la incidencia
export const getColorEstadoIncidencia = (estado: EstadoIncidencia): { bg: string; text: string; dark: string } => {
  switch (estado) {
    case 'pendiente':
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        dark: 'dark:bg-yellow-900/30 dark:text-yellow-400'
      };
    case 'en_revision':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        dark: 'dark:bg-blue-900/30 dark:text-blue-400'
      };
    case 'resuelta':
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        dark: 'dark:bg-green-900/30 dark:text-green-400'
      };
    case 'cerrada':
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        dark: 'dark:bg-gray-900/30 dark:text-gray-400'
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        dark: 'dark:bg-gray-900/30 dark:text-gray-400'
      };
  }
}; 