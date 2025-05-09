// Define los estados posibles de las reservas
export type EstadoReserva = 'pendiente' | 'confirmada' | 'cancelada' | 'completada';

// Define la estructura de una reserva
export interface Reserva {
  id: string;
  codigo_reserva: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  precio_total: number;
  estado: EstadoReserva;
  created_at: string;
  usuario_id: string;
  usuario_nombre: string;
  usuario_email: string;
  usuario_telefono?: string;
  espacio_id: string;
  espacio_nombre: string;
  espacio_tipo: string;
  espacio_direccion: string;
  espacio_ciudad: string;
  propietario_id: string;
  propietario_nombre: string;
  propietario_email: string;
  notas?: string;
  metodo_pago?: string;
  id_transaccion?: string;
  cancelado_por?: string;
  motivo_cancelacion?: string;
  updated_at?: string;
}

// Define los filtros para las consultas de reservas
export interface FiltrosReservas {
  estado?: EstadoReserva | 'todas';
  fecha_desde?: string;
  fecha_hasta?: string;
  page?: number;
  per_page?: number;
}

// Interfaz para la respuesta de cancelación de reserva
export interface RespuestaCancelacion {
  success: boolean;
  message: string;
}

// Función para formatear la fecha de la reserva
export const formatearFechaReserva = (fecha: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  };
  
  return new Date(fecha).toLocaleDateString('es-ES', options);
};

// Función para formatear la hora
export const formatearHora = (hora: string): string => {
  // La hora viene en formato '15:30:00', queremos '15:30'
  return hora.substring(0, 5);
};

// Función para obtener el color según el estado
export const getColorEstadoReserva = (estado: EstadoReserva): { bg: string; text: string; dark: string } => {
  switch (estado) {
    case 'confirmada':
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        dark: 'dark:bg-green-900/30 dark:text-green-400'
      };
    case 'pendiente':
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        dark: 'dark:bg-yellow-900/30 dark:text-yellow-400'
      };
    case 'cancelada':
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        dark: 'dark:bg-red-900/30 dark:text-red-400'
      };
    case 'completada':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        dark: 'dark:bg-blue-900/30 dark:text-blue-400'
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        dark: 'dark:bg-gray-900/30 dark:text-gray-400'
      };
  }
}; 