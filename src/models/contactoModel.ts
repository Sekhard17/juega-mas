import supabase from '@/lib/supabaseClient';

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
      const { data, error } = await supabase
        .from('mensajes_contacto')
        .insert([
          {
            nombre: mensajeData.nombre,
            email: mensajeData.email,
            telefono: mensajeData.telefono || null,
            asunto: mensajeData.asunto,
            mensaje: mensajeData.mensaje,
            leido: false,
            respondido: false
          }
        ])
        .select();

      if (error) throw error;
      
      return data[0] as MensajeContacto;
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
      const { data, error } = await supabase
        .from('mensajes_contacto')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data as MensajeContacto[];
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
      const { error } = await supabase
        .from('mensajes_contacto')
        .update({ leido: true })
        .eq('id', mensajeId);

      if (error) throw error;
      
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
      const { error } = await supabase
        .from('mensajes_contacto')
        .update({ respondido: true })
        .eq('id', mensajeId);

      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error al marcar mensaje como respondido:', error);
      return false;
    }
  }
}; 