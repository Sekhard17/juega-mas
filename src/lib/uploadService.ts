import supabase from './supabaseClient';

// Nombre del bucket de Supabase para almacenar imágenes de recintos deportivos
const BUCKET_NAME = 'recintos';

/**
 * Genera un nombre de archivo único basado en timestamp y número aleatorio
 */
const generateUniqueFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const ext = originalName.split('.').pop();
  return `img_${timestamp}_${random}.${ext}`;
};

export const uploadService = {
  /**
   * Sube una imagen al bucket "recintos" de Supabase
   * @param file Archivo a subir
   * @param path Ruta opcional dentro del bucket (por defecto: 'espacios')
   * @returns Promise con la URL pública del archivo subido o null si falla
   */
  async uploadImage(file: File, path: string = 'espacios'): Promise<string | null> {
    try {
      // Verificar que el archivo sea una imagen
      if (!file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen');
      }

      // Generar un nombre único para el archivo
      const fileName = generateUniqueFileName(file.name);
      const filePath = `${path}/${fileName}`;

      // Subir el archivo al bucket
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Obtener la URL pública del archivo
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error al subir imagen a Supabase:', error);
      return null;
    }
  },

  /**
   * Sube múltiples imágenes al bucket "recintos" de Supabase
   * @param files Array de archivos a subir
   * @param path Ruta opcional dentro del bucket (por defecto: 'espacios')
   * @returns Promise con un array de URLs públicas de los archivos subidos
   */
  async uploadMultipleImages(files: File[], path: string = 'espacios'): Promise<string[]> {
    try {
      const uploadPromises = files.map(file => this.uploadImage(file, path));
      const results = await Promise.all(uploadPromises);
      
      // Filtrar resultados nulos
      return results.filter(url => url !== null) as string[];
    } catch (error) {
      console.error('Error al subir múltiples imágenes:', error);
      return [];
    }
  },

  /**
   * Elimina una imagen del bucket "recintos" de Supabase
   * @param url URL pública de la imagen a eliminar
   * @returns Promise<boolean> que indica si la eliminación fue exitosa
   */
  async deleteImage(url: string): Promise<boolean> {
    try {
      // Extraer la ruta del archivo de la URL
      const baseUrl = supabase.storage.from(BUCKET_NAME).getPublicUrl('').data.publicUrl;
      const filePath = url.replace(baseUrl, '');
      
      // Eliminar el archivo
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error al eliminar imagen de Supabase:', error);
      return false;
    }
  }
}; 