import { API_ROUTES } from '@/lib/apiConfig';

export interface MensajeContacto {
  id?: number;
  nombre: string;
  email: string;
  telefono?: string | null;
  asunto: string;
  mensaje: string;
  leido?: boolean;
  respondido?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const contactoModel = {
  /**
   * Crear un nuevo mensaje de contacto
   */
  async crearMensaje(mensajeData: MensajeContacto): Promise<MensajeContacto | null> {
    try {
      const response = await fetch(API_ROUTES.CONTACTO.ENVIAR, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: mensajeData.nombre,
          email: mensajeData.email,
          telefono: mensajeData.telefono || null,
          asunto: mensajeData.asunto,
          mensaje: mensajeData.mensaje
        })
      });

      if (!response.ok) {
        throw new Error('Error al enviar mensaje de contacto');
      }

      const data = await response.json();
      return data.mensaje as MensajeContacto;
    } catch (error) {
      console.error('Error al crear mensaje de contacto:', error);
      return null;
    }
  },

  /**
   * Obtener todos los mensajes de contacto
   */
  async obtenerMensajes(): Promise<MensajeContacto[]> {
    try {
      const url = API_ROUTES.CONTACTO.MENSAJES;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener mensajes de contacto');
      }

      const data = await response.json();
      return data.mensajes as MensajeContacto[];
    } catch (error) {
      console.error('Error al obtener mensajes de contacto:', error);
      return [];
    }
  },

  /**
   * Marcar mensaje como leído
   */
  async marcarComoLeido(mensajeId: number): Promise<boolean> {
    try {
      const url = API_ROUTES.CONTACTO.LEER(mensajeId);
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al marcar mensaje como leído');
      }

      return true;
    } catch (error) {
      console.error('Error al marcar mensaje como leído:', error);
      return false;
    }
  },

  /**
   * Marcar mensaje como respondido
   */
  async marcarComoRespondido(mensajeId: number): Promise<boolean> {
    try {
      const url = API_ROUTES.CONTACTO.RESPONDER(mensajeId);
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al marcar mensaje como respondido');
      }

      return true;
    } catch (error) {
      console.error('Error al marcar mensaje como respondido:', error);
      return false;
    }
  }
}; 