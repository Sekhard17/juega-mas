'use client';

import { useState, useRef } from 'react';
import { EspacioDeportivo, ImagenEspacio } from '@/types/espacio';
import { XCircleIcon, ArrowUpTrayIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { uploadService } from '@/lib/uploadService';
import { toast } from 'sonner';

interface ImagenesProps {
  datos: Partial<EspacioDeportivo>;
  actualizarDatos: (datos: Partial<EspacioDeportivo>) => void;
  siguientePaso: () => void;
  pasoAnterior: () => void;
}

export default function Imagenes({
  datos,
  actualizarDatos,
  siguientePaso,
  pasoAnterior
}: ImagenesProps) {
  const [cargando, setCargando] = useState(false);
  const [arrastrando, setArrastrando] = useState(false);
  const [subiendoImagenes, setSubiendoImagenes] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estado local para las imágenes
  const [imagenes, setImagenes] = useState<ImagenEspacio[]>(
    datos.imagenes || []
  );
  
  // Estado local para la imagen principal
  const [imagenPrincipal, setImagenPrincipal] = useState<string>(
    datos.imagen_principal || ''
  );

  // Función para subir imágenes a Supabase
  const subirImagen = async (file: File): Promise<string | null> => {
    try {
      // Subir imagen al bucket "recintos" de Supabase
      const url = await uploadService.uploadImage(file);
      return url;
    } catch (error) {
      console.error('Error al subir imagen:', error);
      return null;
    }
  };

  // Manejar el arrastre de archivos
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setArrastrando(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setArrastrando(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setArrastrando(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await procesarArchivos(files);
    }
  };

  // Manejar la selección de archivos por input
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await procesarArchivos(Array.from(e.target.files));
      // Limpiar el input para permitir seleccionar el mismo archivo de nuevo
      e.target.value = '';
    }
  };

  // Procesar los archivos seleccionados
  const procesarArchivos = async (files: File[]) => {
    // Filtrar solo archivos de imagen
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast.error('Por favor, selecciona archivos de imagen válidos (jpg, png, etc.)');
      return;
    }
    
    setCargando(true);
    setSubiendoImagenes(true);
    
    try {
      // Mostrar mensaje de carga
      toast.loading(`Subiendo ${imageFiles.length} imágenes...`);
      
      // Subir múltiples imágenes al bucket "recintos" de Supabase
      const imageUrls = await uploadService.uploadMultipleImages(imageFiles);
      
      if (imageUrls.length === 0) {
        throw new Error('No se pudo subir ninguna imagen');
      }
      
      // Crear objetos de imagen con las URLs y asignar IDs temporales
      const nuevasImagenes: ImagenEspacio[] = imageUrls.map((url, index) => ({
        id: -(Date.now() + index), // ID temporal negativo
        url: url,
        orden: imagenes.length + index + 1
      }));
      
      // Agregar las nuevas imágenes a la lista
      setImagenes(prev => [...prev, ...nuevasImagenes]);
      
      // Si es la primera imagen, establecerla como principal
      if (imagenes.length === 0 && !imagenPrincipal && nuevasImagenes.length > 0) {
        setImagenPrincipal(nuevasImagenes[0].url);
      }
      
      // Mostrar mensaje de éxito
      toast.success(`${nuevasImagenes.length} imágenes subidas con éxito`);
      
    } catch (error) {
      console.error('Error al procesar imágenes:', error);
      toast.error('Ocurrió un error al subir las imágenes. Por favor, intenta de nuevo.');
    } finally {
      setCargando(false);
      setSubiendoImagenes(false);
    }
  };

  // Establecer una imagen como principal
  const seleccionarImagenPrincipal = (url: string) => {
    setImagenPrincipal(url);
    toast.success('Imagen principal actualizada');
  };

  // Eliminar una imagen
  const eliminarImagen = async (id: number, url: string) => {
    try {
      setCargando(true);
      
      // Si la imagen tiene una URL real (no data:image), intentar eliminarla de Supabase
      if (url.startsWith('http')) {
        await uploadService.deleteImage(url);
      }
      
      const imagenAEliminar = imagenes.find(img => img.id === id);
      
      setImagenes(prev => prev.filter(img => img.id !== id));
      
      // Si la imagen eliminada era la principal, establecer otra como principal
      if (imagenAEliminar && imagenAEliminar.url === imagenPrincipal) {
        if (imagenes.length > 1) {
          // Buscar otra imagen que no sea la que se está eliminando
          const otraImagen = imagenes.find(img => img.id !== id);
          if (otraImagen) {
            setImagenPrincipal(otraImagen.url);
          } else {
            setImagenPrincipal('');
          }
        } else {
          setImagenPrincipal('');
        }
      }
      
      toast.success('Imagen eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      toast.error('Error al eliminar la imagen');
    } finally {
      setCargando(false);
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (imagenes.length === 0) {
      toast.error('Por favor, agrega al menos una imagen de tu espacio deportivo.');
      return;
    }
    
    if (!imagenPrincipal) {
      toast.error('Por favor, selecciona una imagen principal.');
      return;
    }
    
    setCargando(true);
    
    // Actualizar datos en el estado principal
    actualizarDatos({
      imagenes,
      imagen_principal: imagenPrincipal
    });
    
    setTimeout(() => {
      setCargando(false);
      siguientePaso();
    }, 500);
  };

  // Animación para las tarjetas de imágenes
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Imágenes del Espacio
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Sube imágenes de tu espacio deportivo. Selecciona una de ellas como imagen principal para mostrar en los listados.
        </p>
      </div>
      
      {/* Área para arrastrar o seleccionar imágenes */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          arrastrando
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
            : 'border-gray-300 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-600'
        } transition-all duration-200 cursor-pointer`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
        
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
            <ArrowUpTrayIcon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">
            Arrastra imágenes o haz clic para subirlas
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB.
          </p>
          {subiendoImagenes && (
            <div className="mt-2">
              <div className="flex items-center justify-center">
                <div className="animate-spin h-5 w-5 border-2 border-emerald-500 rounded-full border-t-transparent"></div>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">Subiendo imágenes...</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Previsualización de imágenes */}
      {imagenes.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
            Imágenes seleccionadas ({imagenes.length})
          </h3>
          
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {imagenes.map((imagen) => (
              <motion.div
                key={imagen.id}
                variants={itemVariants}
                className={`relative rounded-lg overflow-hidden border-2 ${
                  imagen.url === imagenPrincipal
                    ? 'border-emerald-500 dark:border-emerald-400 shadow-md'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="relative aspect-square">
                  <Image
                    src={imagen.url}
                    alt={`Imagen ${imagen.id}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/50 transition-all duration-200">
                  <div className="flex space-x-2">
                    {/* Botón para establecer como principal */}
                    <button
                      type="button"
                      className={`p-2 rounded-full ${
                        imagen.url === imagenPrincipal
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white text-gray-800 hover:bg-emerald-500 hover:text-white'
                      } transition-all duration-200`}
                      onClick={() => seleccionarImagenPrincipal(imagen.url)}
                    >
                      <PhotoIcon className="w-5 h-5" />
                    </button>
                    
                    {/* Botón para eliminar */}
                    <button
                      type="button"
                      className="p-2 rounded-full bg-white text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
                      onClick={() => eliminarImagen(imagen.id, imagen.url)}
                    >
                      <XCircleIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Indicador de imagen principal */}
                {imagen.url === imagenPrincipal && (
                  <div className="absolute bottom-0 left-0 right-0 bg-emerald-500 text-white text-xs font-medium py-1 text-center">
                    Imagen Principal
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
      
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={pasoAnterior}
          className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200"
        >
          Atrás
        </button>
        
        <button
          type="submit"
          disabled={cargando}
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center disabled:bg-emerald-400 disabled:cursor-not-allowed"
        >
          {cargando ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </>
          ) : (
            'Continuar'
          )}
        </button>
      </div>
    </form>
  );
} 