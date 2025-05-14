import { API_ROUTES } from '@/lib/apiConfig';
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

      // Realizar la solicitud a la API
      const response = await fetch(API_ROUTES.INCIDENCIAS.CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify(incidenciaData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear incidencia');
      }

      const data = await response.json();

      return {
        success: true,
        message: data.message || 'Incidencia reportada correctamente',
        incidencia: data.incidencia
      };
    } catch (error) {
      console.error('Error al crear incidencia:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Ocurrió un error al reportar la incidencia'
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
      // Verificar que tenemos un ID de usuario
      if (!usuarioId) {
        console.error('No se proporcionó un ID de usuario para listarIncidenciasUsuario');
        return { incidencias: [], total: 0 };
      }

      // Construir la URL con los parámetros de filtro
      const params = new URLSearchParams();
      
      if (filtros.tipo) params.append('tipo', filtros.tipo);
      if (filtros.estado) params.append('estado', filtros.estado);
      if (filtros.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
      if (filtros.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);
      if (filtros.reserva_id) params.append('reserva_id', filtros.reserva_id);
      
      // Parámetros de paginación
      params.append('page', (filtros.page || 1).toString());
      params.append('per_page', (filtros.per_page || 10).toString());
      
      const url = `${API_ROUTES.INCIDENCIAS.LIST}?${params.toString()}`;
      
      // Realizar la solicitud
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener incidencias del usuario');
      }
      
      const data = await response.json();
      
      return {
        incidencias: data.incidencias || [],
        total: data.total || 0,
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

      const url = API_ROUTES.INCIDENCIAS.DETAIL(id);
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error al obtener detalle de la incidencia ${id}`);
      }
      
      const incidencia = await response.json();
      return incidencia;
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

      // Preparar datos a actualizar
      const datosActualizados = {
        ...actualizaciones,
        fecha_actualizacion: new Date().toISOString(),
      };

      // Realizar la solicitud
      const url = API_ROUTES.INCIDENCIAS.UPDATE(id);
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify(datosActualizados)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar incidencia');
      }
      
      const data = await response.json();

      return {
        success: true,
        message: data.message || 'Incidencia actualizada correctamente',
      };
    } catch (error) {
      console.error('Error al actualizar incidencia:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Ocurrió un error al actualizar la incidencia',
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

      // Realizar la solicitud
      const url = API_ROUTES.INCIDENCIAS.CERRAR(id);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cerrar incidencia');
      }
      
      const data = await response.json();

      return {
        success: true,
        message: data.message || 'Incidencia cerrada correctamente',
      };
    } catch (error) {
      console.error('Error al cerrar incidencia:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Ocurrió un error al cerrar la incidencia',
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

      // Realizar solicitud a la API para obtener estadísticas
      const url = `${API_ROUTES.INCIDENCIAS.ESTADISTICAS}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener estadísticas de incidencias');
      }
      
      const estadisticas = await response.json();
      
      return estadisticas || { total: 0, pendientes: 0, en_revision: 0, resueltas: 0, cerradas: 0 };
    } catch (error) {
      console.error('Error al obtener estadísticas de incidencias:', error);
      return { total: 0, pendientes: 0, en_revision: 0, resueltas: 0, cerradas: 0 };
    }
  }
}; 