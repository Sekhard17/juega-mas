import supabase from '@/lib/supabaseClient';
import { User } from '@/types/user';

export interface UpdateProfileData {
  nombre?: string;
  telefono?: string;
  foto_perfil?: string;
  biografia?: string;
  notificaciones_email?: boolean;
  notificaciones_app?: boolean;
}

export const userModel = {
  /**
   * Actualizar perfil de usuario
   */
  async updateProfile(userId: number, data: UpdateProfileData): Promise<User | null> {
    try {
      // Asegurarse de que el nombre no pueda ser modificado
      if (data.nombre) {
        delete data.nombre;
      }
      
      // Crear un objeto con solo los campos con valor
      const updateData: Record<string, any> = {};
      
      // Solo incluir campos que tengan un valor definido
      if (data.telefono !== undefined) updateData.telefono = data.telefono;
      
      // Verificar si hay campos para actualizar
      if (Object.keys(updateData).length === 0) {
        // Si no hay campos para actualizar, solo devolver el usuario actual
        const { data: currentUser, error: fetchError } = await supabase
          .from('usuarios')
          .select('id, email, nombre, telefono, foto_perfil, role, created_at, updated_at')
          .eq('id', userId)
          .single();
          
        if (fetchError) throw fetchError;
        return currentUser as User;
      }
      
      // Actualizar solo los campos necesarios
      const { data: updatedUser, error } = await supabase
        .from('usuarios')
        .update(updateData)
        .eq('id', userId)
        .select('id, email, nombre, telefono, foto_perfil, role, created_at, updated_at')
        .single();
      
      if (error) throw error;
      
      return updatedUser as User;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      return null;
    }
  },

  /**
   * Actualizar foto de perfil
   */
  async updateProfilePhoto(userId: number, photoFile: File): Promise<string | null> {
    try {
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `avatar-${userId}-${Date.now()}.${fileExt}`;
      
      // Subir archivo a Supabase Storage
      const { error: uploadError } = await supabase
        .storage
        .from('avatares')
        .upload(fileName, photoFile);
      
      if (uploadError) throw uploadError;
      
      // Obtener URL pública del archivo
      const { data: { publicUrl } } = supabase
        .storage
        .from('avatares')
        .getPublicUrl(fileName);
      
      // Actualizar el perfil del usuario con la nueva URL de foto
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ foto_perfil: publicUrl })
        .eq('id', userId);
      
      if (updateError) throw updateError;
      
      return publicUrl;
    } catch (error) {
      console.error('Error al actualizar foto de perfil:', error);
      return null;
    }
  },

  /**
   * Cambiar contraseña
   */
  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      // Obtener usuario y verificar contraseña actual
      const { data: user, error } = await supabase
        .from('usuarios')
        .select('password_hash')
        .eq('id', userId)
        .single();
      
      if (error || !user) return false;
      
      // Verificar contraseña actual
      const bcrypt = await import('bcryptjs');
      const isValidPassword = await bcrypt.compare(
        currentPassword, 
        user.password_hash
      );
      
      if (!isValidPassword) return false;
      
      // Generar nueva contraseña hasheada
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      // Actualizar contraseña
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ password_hash: hashedPassword })
        .eq('id', userId);
      
      if (updateError) throw updateError;
      
      return true;
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      return false;
    }
  }
}; 