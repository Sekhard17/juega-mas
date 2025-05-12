import { supabase } from '@/lib/supabaseClient';
import { 
  EstadisticasEspacio, 
  EstadisticasMensuales,
  OcupacionEspacio,
  TendenciaDia,
  TendenciaHora, 
  ResumenPropietario 
} from '@/types/estadisticas';

export class EstadisticasModel {
  /**
   * Obtiene las estadísticas diarias de un espacio específico
   * @param espacioId - ID del espacio
   * @returns Estadísticas del espacio o null si hay error
   */
  static async obtenerEstadisticasEspacio(espacioId: number): Promise<EstadisticasEspacio | null> {
    try {
      // Verificar que el espacio existe
      const { data: espacio, error: errorEspacio } = await supabase
        .from('espacios_deportivos')
        .select('id, nombre, propietario_id')
        .eq('id', espacioId)
        .single();

      if (errorEspacio || !espacio) {
        console.error('Espacio no encontrado:', errorEspacio);
        return null;
      }

      // Usar la función que creamos en la base de datos
      const { data, error } = await supabase
        .rpc('obtener_estadisticas_espacio', { espacio_id_param: espacioId });

      if (error) {
        console.error('Error al obtener estadísticas:', error);
        return null;
      }

      // Asegurarse de que data sea un objeto único, no un array
      const estadisticas = Array.isArray(data) ? data[0] : data;
      
      // Asegurarse de que los valores numéricos no sean null
      return {
        reservas_hoy: estadisticas?.reservas_hoy || 0,
        ganancias_dia: estadisticas?.ganancias_dia || 0,
        cancha_popular: estadisticas?.cancha_popular || 'No disponible',
        horario_popular: estadisticas?.horario_popular || 'No disponible'
      };
    } catch (error) {
      console.error('Error en el modelo de estadísticas:', error);
      return null;
    }
  }

  /**
   * Obtiene las estadísticas mensuales de un espacio
   * @param espacioId - ID del espacio
   * @returns Estadísticas mensuales o null si hay error
   */
  static async obtenerEstadisticasMensuales(espacioId: number): Promise<EstadisticasMensuales | null> {
    try {
      const { data, error } = await supabase
        .from('vista_estadisticas_mensuales')
        .select('*')
        .eq('espacio_id', espacioId)
        .single();

      if (error) {
        console.error('Error al obtener estadísticas mensuales:', error);
        return null;
      }

      return data as EstadisticasMensuales;
    } catch (error) {
      console.error('Error en el modelo de estadísticas:', error);
      return null;
    }
  }

  /**
   * Obtiene datos de ocupación de un espacio
   * @param espacioId - ID del espacio
   * @returns Datos de ocupación o null si hay error
   */
  static async obtenerOcupacionEspacio(espacioId: number): Promise<OcupacionEspacio | null> {
    try {
      const { data, error } = await supabase
        .from('vista_ocupacion_espacios')
        .select('*')
        .eq('espacio_id', espacioId)
        .single();

      if (error) {
        console.error('Error al obtener datos de ocupación:', error);
        return null;
      }

      return data as OcupacionEspacio;
    } catch (error) {
      console.error('Error en el modelo de estadísticas:', error);
      return null;
    }
  }

  /**
   * Obtiene tendencias de reservas por día de semana
   * @param espacioId - ID del espacio
   * @returns Array de tendencias por día o array vacío si hay error
   */
  static async obtenerTendenciasDias(espacioId: number): Promise<TendenciaDia[]> {
    try {
      const { data, error } = await supabase
        .from('vista_tendencias_dias')
        .select('*')
        .eq('espacio_id', espacioId)
        .order('dia_semana');

      if (error) {
        console.error('Error al obtener tendencias por día:', error);
        return [];
      }

      return data as TendenciaDia[];
    } catch (error) {
      console.error('Error en el modelo de estadísticas:', error);
      return [];
    }
  }

  /**
   * Obtiene tendencias de reservas por hora
   * @param espacioId - ID del espacio
   * @returns Array de tendencias por hora o array vacío si hay error
   */
  static async obtenerTendenciasHoras(espacioId: number): Promise<TendenciaHora[]> {
    try {
      const { data, error } = await supabase
        .from('vista_tendencias_horas')
        .select('*')
        .eq('espacio_id', espacioId)
        .order('total_reservas', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error al obtener tendencias por hora:', error);
        return [];
      }

      return data as TendenciaHora[];
    } catch (error) {
      console.error('Error en el modelo de estadísticas:', error);
      return [];
    }
  }

  /**
   * Obtiene un resumen general del propietario
   * @param propietarioId - ID del propietario
   * @returns Resumen del propietario o null si hay error
   */
  static async obtenerResumenPropietario(propietarioId: number): Promise<ResumenPropietario | null> {
    try {
      const { data, error } = await supabase
        .from('vista_resumen_propietario')
        .select('*')
        .eq('propietario_id', propietarioId)
        .single();

      if (error) {
        console.error('Error al obtener resumen del propietario:', error);
        return null;
      }

      return data as ResumenPropietario;
    } catch (error) {
      console.error('Error en el modelo de estadísticas:', error);
      return null;
    }
  }
} 