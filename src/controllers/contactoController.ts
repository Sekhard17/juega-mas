import { contactoModel, MensajeContacto } from '@/models/contactoModel';
import { z } from 'zod';

// Esquema de validación
const mensajeContactoSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z.string().optional().nullable(),
  asunto: z.string().min(5, 'El asunto debe tener al menos 5 caracteres'),
  mensaje: z.string().min(20, 'El mensaje debe tener al menos 20 caracteres')
});

export class ContactoController {
  /**
   * Crear un nuevo mensaje de contacto
   */
  static async crearMensaje(mensajeData: Omit<MensajeContacto, 'id' | 'leido' | 'respondido' | 'created_at' | 'updated_at'>): Promise<MensajeContacto | null> {
    try {
      // Validar datos
      const validationResult = mensajeContactoSchema.safeParse(mensajeData);
      if (!validationResult.success) {
        throw new Error('Datos de contacto inválidos');
      }

      // Crear mensaje
      const mensaje = await contactoModel.crearMensaje(validationResult.data);
      if (!mensaje) {
        throw new Error('Error al crear el mensaje de contacto');
      }

      return mensaje;
    } catch (error) {
      console.error('Error en el controlador de contacto:', error);
      return null;
    }
  }

  /**
   * Obtener todos los mensajes de contacto
   */
  static async obtenerMensajes(): Promise<MensajeContacto[]> {
    try {
      return await contactoModel.obtenerMensajes();
    } catch (error) {
      console.error('Error al obtener mensajes de contacto:', error);
      return [];
    }
  }

  /**
   * Marcar mensaje como leído
   */
  static async marcarComoLeido(mensajeId: number): Promise<boolean> {
    try {
      return await contactoModel.marcarComoLeido(mensajeId);
    } catch (error) {
      console.error('Error al marcar mensaje como leído:', error);
      return false;
    }
  }

  /**
   * Marcar mensaje como respondido
   */
  static async marcarComoRespondido(mensajeId: number): Promise<boolean> {
    try {
      return await contactoModel.marcarComoRespondido(mensajeId);
    } catch (error) {
      console.error('Error al marcar mensaje como respondido:', error);
      return false;
    }
  }
} 