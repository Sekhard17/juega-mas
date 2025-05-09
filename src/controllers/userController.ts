import { userModel, UpdateProfileData } from "@/models/userModel";

export const userController = {
  /**
   * Actualizar perfil de usuario
   */
  async updateProfile(userId: number, data: UpdateProfileData) {
    try {
      const updatedUser = await userModel.updateProfile(userId, data);
      return {
        success: !!updatedUser,
        user: updatedUser,
        error: updatedUser ? null : 'Error al actualizar el perfil'
      };
    } catch (error) {
      console.error("Error en controlador al actualizar perfil:", error);
      return {
        success: false,
        user: null,
        error: 'Error al actualizar el perfil'
      };
    }
  },

  /**
   * Actualizar foto de perfil
   */
  async updateProfilePhoto(userId: number, photoFile: File) {
    try {
      const photoUrl = await userModel.updateProfilePhoto(userId, photoFile);
      return {
        success: !!photoUrl,
        photoUrl,
        error: photoUrl ? null : 'Error al actualizar la foto de perfil'
      };
    } catch (error) {
      console.error("Error en controlador al actualizar foto:", error);
      return {
        success: false,
        photoUrl: null,
        error: 'Error al actualizar la foto de perfil'
      };
    }
  },

  /**
   * Cambiar contraseña
   */
  async changePassword(userId: number, currentPassword: string, newPassword: string) {
    try {
      const success = await userModel.changePassword(userId, currentPassword, newPassword);
      return {
        success,
        error: success ? null : 'La contraseña actual es incorrecta'
      };
    } catch (error) {
      console.error("Error en controlador al cambiar contraseña:", error);
      return {
        success: false,
        error: 'Error al cambiar la contraseña'
      };
    }
  }
}; 