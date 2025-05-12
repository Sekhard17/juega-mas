// Tipos para estadísticas diarias de un espacio
export interface EstadisticasEspacio {
  reservas_hoy: number;
  ganancias_dia: number;
  cancha_popular: string;
  horario_popular: string;
}

// Tipos para estadísticas mensuales
export interface EstadisticasMensuales {
  espacio_id: number;
  espacio_nombre: string;
  propietario_id: number;
  año: number;
  mes: number;
  reservas_totales: number;
  dias_con_reservas: number;
  ganancias_mes: number;
  puntuacion_promedio: number;
  total_reseñas: number;
}

// Tipos para ocupación de espacios
export interface OcupacionEspacio {
  espacio_id: number;
  espacio_nombre: string;
  propietario_id: number;
  total_horarios_disponibles: number;
  total_reservas_semana: number;
  porcentaje_ocupacion: number;
}

// Tipos para tendencias por día de semana
export interface TendenciaDia {
  espacio_id: number;
  espacio_nombre: string;
  propietario_id: number;
  dia_semana: number;
  total_reservas: number;
  total_ganancias: number;
}

// Tipos para tendencias por hora
export interface TendenciaHora {
  espacio_id: number;
  espacio_nombre: string;
  propietario_id: number;
  hora_inicio: string;
  total_reservas: number;
}

// Tipos para resumen de propietario
export interface ResumenPropietario {
  propietario_id: number;
  propietario_nombre: string;
  total_espacios: number;
  ganancias_totales: number;
  total_reservas: number;
  reservas_hoy: number;
  ganancias_hoy: number;
  reservas_proxima_semana: number;
  calificacion_promedio: number;
} 