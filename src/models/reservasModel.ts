import supabase from '@/lib/supabaseClient';
import { Reserva, FiltrosReservas } from '@/types/reserva';


export const reservasModel = {
  /**
   * Obtener listado de reservas del usuario actual con filtros
   */
  async listarReservasUsuario(
    filtros: FiltrosReservas = {},
    usuarioId?: string
  ): Promise<{ reservas: Reserva[]; total: number }> {
    try {
      const { 
        estado, 
        fecha_desde, 
        fecha_hasta, 
        page = 1, 
        per_page = 10 
      } = filtros;

      // Verificar que tenemos un ID de usuario
      if (!usuarioId) {
        console.error('No se proporcionó un ID de usuario para listarReservasUsuario');
        return { reservas: [], total: 0 };
      }

      let query = supabase
        .from('vista_reservas_completa')
        .select('*', { count: 'exact' })
        .eq('usuario_id', usuarioId)
        .order('fecha', { ascending: true })
        .order('hora_inicio', { ascending: true });

      // Aplicar filtros si están presentes
      if (estado && estado !== 'todas') {
        query = query.eq('estado', estado);
      }

      if (fecha_desde) {
        query = query.gte('fecha', fecha_desde);
      }

      if (fecha_hasta) {
        query = query.lte('fecha', fecha_hasta);
      }

      // Aplicar paginación
      const desde = (page - 1) * per_page;
      query = query.range(desde, desde + per_page - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        reservas: data as Reserva[],
        total: count || 0,
      };
    } catch (error) {
      console.error('Error al obtener reservas del usuario:', error);
      return { reservas: [], total: 0 };
    }
  },

  /**
   * Obtener detalle de una reserva específica por ID
   */
  async obtenerReserva(id: string, usuarioId?: string): Promise<Reserva | null> {
    try {
      // Verificar que tenemos un ID de usuario
      if (!usuarioId) {
        console.error('No se proporcionó un ID de usuario para obtenerReserva');
        return null;
      }

      const { data, error } = await supabase
        .from('vista_reservas_completa')
        .select('*')
        .eq('id', id)
        .eq('usuario_id', usuarioId)
        .single();

      if (error) throw error;
      return data as Reserva;
    } catch (error) {
      console.error('Error al obtener detalle de la reserva:', error);
      return null;
    }
  },

  /**
   * Obtener las próximas reservas del usuario (para mostrar en el dashboard)
   */
  async obtenerProximasReservas(limite: number = 3, usuarioId?: string): Promise<Reserva[]> {
    try {
      // Verificar que tenemos un ID de usuario
      if (!usuarioId) {
        console.error('No se proporcionó un ID de usuario para obtenerProximasReservas');
        throw new Error('Usuario no autenticado');
      }
      
      const fechaActual = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

      const { data, error } = await supabase
        .from('vista_reservas_completa')
        .select('*')
        .eq('usuario_id', usuarioId)
        .gte('fecha', fechaActual)
        .in('estado', ['pendiente', 'confirmada'])
        .order('fecha', { ascending: true })
        .order('hora_inicio', { ascending: true })
        .limit(limite);

      if (error) throw error;

      return data as Reserva[];
    } catch (error) {
      console.error('Error al obtener próximas reservas:', error);
      throw error; // Re-lanzar el error para que pueda ser manejado por el componente
    }
  },

  /**
   * Cancelar una reserva específica
   */
  async cancelarReserva(id: string, motivo: string, usuarioId?: string): Promise<{ success: boolean; message: string }> {
    try {
      // Verificar que tenemos un ID de usuario
      if (!usuarioId) {
        console.error('No se proporcionó un ID de usuario para cancelarReserva');
        return {
          success: false,
          message: 'Usuario no autenticado',
        };
      }

      // Verificar que la reserva pertenece al usuario y está en un estado que se puede cancelar
      const { data: reserva } = await supabase
        .from('reservas')
        .select('*')
        .eq('id', id)
        .eq('usuario_id', usuarioId)
        .in('estado', ['pendiente', 'confirmada'])
        .single();

      if (!reserva) {
        return {
          success: false,
          message: 'No se encontró la reserva o no puede ser cancelada',
        };
      }

      // Actualizar estado de la reserva
      const { error } = await supabase
        .from('reservas')
        .update({
          estado: 'cancelada',
          motivo_cancelacion: motivo,
          cancelado_por: usuarioId,
          updated_at: new Date(),
        })
        .eq('id', id);

      if (error) throw error;

      return {
        success: true,
        message: 'Reserva cancelada correctamente',
      };
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      return {
        success: false,
        message: 'Ocurrió un error al cancelar la reserva',
      };
    }
  },
}; 