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
      const { data: updatedUser, error } = await supabase
        .from('usuarios')
        .update(data)
        .eq('id', userId)
        .select('id, email, nombre, telefono, foto_perfil, biografia, notificaciones_email, notificaciones_app, role, created_at, updated_at')
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
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `profile-photos/${fileName}`;
      
      // Subir archivo a Supabase Storage
      const { error: uploadError } = await supabase
        .storage
        .from('user-content')
        .upload(filePath, photoFile);
      
      if (uploadError) throw uploadError;
      
      // Obtener URL pública del archivo
      const { data: { publicUrl } } = supabase
        .storage
        .from('user-content')
        .getPublicUrl(filePath);
      
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