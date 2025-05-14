import { API_ROUTES } from '@/lib/apiConfig';
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
      // Verificar que tenemos un ID de usuario
      if (!usuarioId) {
        console.error('No se proporcionó un ID de usuario para listarReservasUsuario');
        return { reservas: [], total: 0 };
      }

      // Construir la URL con los parámetros de filtro
      const params = new URLSearchParams();
      
      if (filtros.estado && filtros.estado !== 'todas') params.append('estado', filtros.estado);
      if (filtros.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
      if (filtros.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);
      
      // Parámetros de paginación
      params.append('page', (filtros.page || 1).toString());
      params.append('per_page', (filtros.per_page || 10).toString());
      
      const url = `${API_ROUTES.RESERVAS.LIST}?${params.toString()}`;
      
      // Realizar la solicitud
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener reservas del usuario');
      }
      
      const data = await response.json();
      
      return {
        reservas: data.reservas || [],
        total: data.total || 0,
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

      const url = API_ROUTES.RESERVAS.DETAIL(Number(id));
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error al obtener detalle de la reserva ${id}`);
      }
      
      const reserva = await response.json();
      return reserva;
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
      
      // Construir la URL con los parámetros
      const params = new URLSearchParams();
      params.append('fecha_desde', fechaActual);
      params.append('limite', limite.toString());
      params.append('estado', 'pendiente,confirmada');
      
      const url = `${API_ROUTES.RESERVAS.LIST}/proximas?${params.toString()}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener próximas reservas');
      }
      
      const data = await response.json();
      return data.reservas || [];
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

      const url = API_ROUTES.RESERVAS.CANCEL(Number(id));
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify({ motivo })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cancelar la reserva');
      }
      
      const data = await response.json();
      
      return {
        success: true,
        message: data.message || 'Reserva cancelada correctamente',
      };
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Ocurrió un error al cancelar la reserva',
      };
    }
  },
}; 