import supabase from '@/lib/supabaseClient';
import { Incidencia, FiltrosIncidencia, RespuestaIncidencia, TipoIncidencia } from '@/types/incidencia';

export const incidenciasModel = {
  /**
   * Crear una nueva incidencia
   */
  async crearIncidencia(
    tipoIncidencia: TipoIncidencia,
    asunto: string,
    descripcion: string,
    reservaId?: string,
    archivosAdjuntos?: string[],
    usuarioId?: string
  ): Promise<RespuestaIncidencia> {
    try {
      // Verificar que tenemos un ID de usuario
      if (!usuarioId) {
        console.error('No se proporcionó un ID de usuario para crearIncidencia');
        return {
          success: false,
          message: 'Usuario no autenticado'
        };
      }

      // Preparar datos de la incidencia
      const incidenciaData = {
        usuario_id: usuarioId,
        reserva_id: reservaId,
        tipo: tipoIncidencia,
        asunto,
        descripcion,
        estado: 'pendiente', // Estado inicial
        archivos_adjuntos: archivosAdjuntos,
        fecha_creacion: new Date().toISOString()
      };

      // Insertar en base de datos
      const { data, error } = await supabase
        .from('incidencias')
        .insert(incidenciaData)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        message: 'Incidencia reportada correctamente',
        incidencia: data as Incidencia
      };
    } catch (error) {
      console.error('Error al crear incidencia:', error);
      return {
        success: false,
        message: 'Ocurrió un error al reportar la incidencia'
      };
    }
  },

  /**
   * Listar incidencias del usuario actual con filtros
   */
  async listarIncidenciasUsuario(
    filtros: FiltrosIncidencia = {},
    usuarioId?: string
  ): Promise<{ incidencias: Incidencia[]; total: number }> {
    try {
      const { 
        tipo, 
        estado, 
        fecha_desde, 
        fecha_hasta, 
        reserva_id,
        page = 1, 
        per_page = 10 
      } = filtros;

      // Verificar que tenemos un ID de usuario
      if (!usuarioId) {
        console.error('No se proporcionó un ID de usuario para listarIncidenciasUsuario');
        return { incidencias: [], total: 0 };
      }

      let query = supabase
        .from('incidencias')
        .select('*', { count: 'exact' })
        .eq('usuario_id', usuarioId)
        .order('fecha_creacion', { ascending: false });

      // Aplicar filtros si están presentes
      if (tipo) {
        query = query.eq('tipo', tipo);
      }

      if (estado) {
        query = query.eq('estado', estado);
      }

      if (fecha_desde) {
        query = query.gte('fecha_creacion', fecha_desde);
      }

      if (fecha_hasta) {
        query = query.lte('fecha_creacion', fecha_hasta);
      }

      if (reserva_id) {
        query = query.eq('reserva_id', reserva_id);
      }

      // Aplicar paginación
      const desde = (page - 1) * per_page;
      query = query.range(desde, desde + per_page - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        incidencias: data as Incidencia[],
        total: count || 0,
      };
    } catch (error) {
      console.error('Error al obtener incidencias del usuario:', error);
      return { incidencias: [], total: 0 };
    }
  },

  /**
   * Obtener detalle de una incidencia específica por ID
   */
  async obtenerIncidencia(id: string, usuarioId?: string): Promise<Incidencia | null> {
    try {
      // Verificar que tenemos un ID de usuario
      if (!usuarioId) {
        console.error('No se proporcionó un ID de usuario para obtenerIncidencia');
        return null;
      }

      const { data, error } = await supabase
        .from('incidencias')
        .select('*')
        .eq('id', id)
        .eq('usuario_id', usuarioId)
        .single();

      if (error) throw error;
      return data as Incidencia;
    } catch (error) {
      console.error('Error al obtener detalle de la incidencia:', error);
      return null;
    }
  },

  /**
   * Actualizar una incidencia existente (para añadir más información)
   */
  async actualizarIncidencia(
    id: string, 
    actualizaciones: {
      descripcion?: string;
      archivos_adjuntos?: string[];
    },
    usuarioId?: string
  ): Promise<RespuestaIncidencia> {
    try {
      // Verificar que tenemos un ID de usuario
      if (!usuarioId) {
        console.error('No se proporcionó un ID de usuario para actualizarIncidencia');
        return {
          success: false,
          message: 'Usuario no autenticado',
        };
      }

      // Verificar que la incidencia pertenece al usuario
      const { data: incidencia } = await supabase
        .from('incidencias')
        .select('*')
        .eq('id', id)
        .eq('usuario_id', usuarioId)
        .single();

      if (!incidencia) {
        return {
          success: false,
          message: 'No se encontró la incidencia o no tienes permiso para editarla',
        };
      }

      // Preparar datos a actualizar
      const datosActualizados = {
        ...actualizaciones,
        fecha_actualizacion: new Date().toISOString(),
      };

      // Actualizar incidencia
      const { error } = await supabase
        .from('incidencias')
        .update(datosActualizados)
        .eq('id', id);

      if (error) throw error;

      return {
        success: true,
        message: 'Incidencia actualizada correctamente',
      };
    } catch (error) {
      console.error('Error al actualizar incidencia:', error);
      return {
        success: false,
        message: 'Ocurrió un error al actualizar la incidencia',
      };
    }
  },

  /**
   * Cerrar una incidencia (solo si está en estado pendiente o en_revision)
   */
  async cerrarIncidencia(id: string, usuarioId?: string): Promise<RespuestaIncidencia> {
    try {
      // Verificar que tenemos un ID de usuario
      if (!usuarioId) {
        console.error('No se proporcionó un ID de usuario para cerrarIncidencia');
        return {
          success: false,
          message: 'Usuario no autenticado',
        };
      }

      // Verificar que la incidencia pertenece al usuario y está en un estado válido
      const { data: incidencia } = await supabase
        .from('incidencias')
        .select('*')
        .eq('id', id)
        .eq('usuario_id', usuarioId)
        .in('estado', ['pendiente', 'en_revision'])
        .single();

      if (!incidencia) {
        return {
          success: false,
          message: 'No se encontró la incidencia, no tienes permiso para cerrarla, o ya está cerrada/resuelta',
        };
      }

      // Cerrar incidencia
      const { error } = await supabase
        .from('incidencias')
        .update({
          estado: 'cerrada',
          fecha_actualizacion: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      return {
        success: true,
        message: 'Incidencia cerrada correctamente',
      };
    } catch (error) {
      console.error('Error al cerrar incidencia:', error);
      return {
        success: false,
        message: 'Ocurrió un error al cerrar la incidencia',
      };
    }
  },
  
  /**
   * Obtener estadísticas de incidencias del usuario
   */
  async obtenerEstadisticasIncidencias(usuarioId?: string): Promise<{ 
    total: number; 
    pendientes: number; 
    en_revision: number; 
    resueltas: number; 
    cerradas: number;
  }> {
    try {
      // Verificar que tenemos un ID de usuario
      if (!usuarioId) {
        console.error('No se proporcionó un ID de usuario para obtenerEstadisticasIncidencias');
        return { total: 0, pendientes: 0, en_revision: 0, resueltas: 0, cerradas: 0 };
      }

      // Obtener todas las incidencias del usuario
      const { data, error } = await supabase
        .from('incidencias')
        .select('estado')
        .eq('usuario_id', usuarioId);

      if (error) throw error;

      // Calcular estadísticas
      const incidencias = data || [];
      const estadisticas = {
        total: incidencias.length,
        pendientes: incidencias.filter(inc => inc.estado === 'pendiente').length,
        en_revision: incidencias.filter(inc => inc.estado === 'en_revision').length,
        resueltas: incidencias.filter(inc => inc.estado === 'resuelta').length,
        cerradas: incidencias.filter(inc => inc.estado === 'cerrada').length,
      };

      return estadisticas;
    } catch (error) {
      console.error('Error al obtener estadísticas de incidencias:', error);
      return { total: 0, pendientes: 0, en_revision: 0, resueltas: 0, cerradas: 0 };
    }
  }
}; 