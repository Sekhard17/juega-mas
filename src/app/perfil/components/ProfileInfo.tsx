'use client';

import { useState } from 'react';
import { User } from '@/types/user';
import { userController } from '@/controllers/userController';
import ImageUploader from '@/components/ui/ImageUploader';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface ProfileInfoProps {
  user: User;
  onProfileUpdated: () => void;
}

export default function ProfileInfo({ user, onProfileUpdated }: ProfileInfoProps) {
  const [nombre, setNombre] = useState(user.nombre || '');
  const [telefono, setTelefono] = useState(user.telefono || '');
  const [biografia, setBiografia] = useState(user.biografia || '');
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Si hay una foto nueva, actualizarla primero
      if (profilePhotoFile) {
        const photoResult = await userController.updateProfilePhoto(user.id, profilePhotoFile);
        if (!photoResult.success) {
          toast.error(photoResult.error || 'Error al actualizar la foto de perfil');
        }
      }

      // Actualizar datos de perfil
      const result = await userController.updateProfile(user.id, {
        nombre,
        telefono,
        biografia
      });

      if (result.success) {
        onProfileUpdated();
      } else {
        toast.error(result.error || 'Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      toast.error('Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoSelected = (file: File) => {
    setProfilePhotoFile(file);
  };

  return (
    <div>
      <motion.h2 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 mb-6"
      >
        Información Personal
      </motion.h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Layout de dos columnas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Columna izquierda: Foto de perfil */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="md:col-span-1"
          >
            <div className="bg-gray-50 dark:bg-gray-800/70 rounded-xl border border-gray-200 dark:border-gray-700 p-4 h-full flex flex-col items-center justify-center shadow-sm">
              <ImageUploader 
                currentImage={user.foto_perfil} 
                onImageSelected={handlePhotoSelected}
              />
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mt-3">
                Foto de perfil
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                Imagen mínima 400x400px
              </p>
            </div>
          </motion.div>

          {/* Columna derecha: Formulario de información */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="md:col-span-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-white mb-1.5">
                  Nombre completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="block w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:bg-gray-700 dark:text-white text-sm pl-10 pr-3 py-2.5 transition-all duration-200"
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 dark:text-white mb-1.5">
                  Teléfono
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    id="telefono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="block w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:bg-gray-700 dark:text-white text-sm pl-10 pr-3 py-2.5 transition-all duration-200"
                    placeholder="+569 XXXXXXXX"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white mb-1.5">
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={user.email}
                    readOnly
                    className="block w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:text-white text-sm cursor-not-allowed pl-10 pr-3 py-2.5 transition-all duration-200"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  El correo electrónico no se puede cambiar.
                </p>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="biografia" className="block text-sm font-medium text-gray-700 dark:text-white mb-1.5">
                  Biografía
                </label>
                <textarea
                  id="biografia"
                  value={biografia}
                  onChange={(e) => setBiografia(e.target.value)}
                  rows={3}
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:bg-gray-700 dark:text-white text-sm p-3 transition-all duration-200"
                  placeholder="Cuéntanos algo sobre ti..."
                />
                <p className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Esta información será visible en tu perfil público.
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`h-11 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md hover:translate-y-[-1px]'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Guardar cambios
                    </span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </form>
    </div>
  );
} 