import { EstadisticasModel } from '@/models/estadisticasModel';
import { 
  EstadisticasEspacio, 
  EstadisticasMensuales, 
  OcupacionEspacio,
  TendenciaDia,
  TendenciaHora,
  ResumenPropietario 
} from '@/types/estadisticas';

export class EstadisticasController {
  /**
   * Obtiene las estadísticas diarias de un espacio específico
   */
  static async obtenerEstadisticasEspacio(espacioId: number): Promise<EstadisticasEspacio | null> {
    try {
      return await EstadisticasModel.obtenerEstadisticasEspacio(espacioId);
    } catch (error) {
      console.error('Error en el controlador de estadísticas:', error);
      throw error;
    }
  }

  /**
   * Obtiene las estadísticas mensuales de un espacio
   */
  static async obtenerEstadisticasMensuales(espacioId: number): Promise<EstadisticasMensuales | null> {
    try {
      return await EstadisticasModel.obtenerEstadisticasMensuales(espacioId);
    } catch (error) {
      console.error('Error en el controlador de estadísticas:', error);
      throw error;
    }
  }

  /**
   * Obtiene datos de ocupación de un espacio
   */
  static async obtenerOcupacionEspacio(espacioId: number): Promise<OcupacionEspacio | null> {
    try {
      return await EstadisticasModel.obtenerOcupacionEspacio(espacioId);
    } catch (error) {
      console.error('Error en el controlador de estadísticas:', error);
      throw error;
    }
  }

  /**
   * Obtiene tendencias de reservas por día de semana
   */
  static async obtenerTendenciasDias(espacioId: number): Promise<TendenciaDia[]> {
    try {
      return await EstadisticasModel.obtenerTendenciasDias(espacioId);
    } catch (error) {
      console.error('Error en el controlador de estadísticas:', error);
      throw error;
    }
  }

  /**
   * Obtiene tendencias de reservas por hora
   */
  static async obtenerTendenciasHoras(espacioId: number): Promise<TendenciaHora[]> {
    try {
      return await EstadisticasModel.obtenerTendenciasHoras(espacioId);
    } catch (error) {
      console.error('Error en el controlador de estadísticas:', error);
      throw error;
    }
  }

  /**
   * Obtiene un resumen general del propietario
   */
  static async obtenerResumenPropietario(propietarioId: number): Promise<ResumenPropietario | null> {
    try {
      return await EstadisticasModel.obtenerResumenPropietario(propietarioId);
    } catch (error) {
      console.error('Error en el controlador de estadísticas:', error);
      throw error;
    }
  }
} 