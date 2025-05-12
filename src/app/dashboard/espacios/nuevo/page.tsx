'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CreacionEspacioStepper from '@/components/dashboard/espacios/CreacionEspacioStepper';
import InfoBasica from '@/components/dashboard/espacios/pasos/InfoBasica';
import UbicacionEspacio from '@/components/dashboard/espacios/pasos/UbicacionEspacio';
import Caracteristicas from '@/components/dashboard/espacios/pasos/Caracteristicas';
import Precios from '@/components/dashboard/espacios/pasos/Precios';
import Horarios from '@/components/dashboard/espacios/pasos/Horarios';
import Imagenes from '@/components/dashboard/espacios/pasos/Imagenes';
import Resumen from '@/components/dashboard/espacios/pasos/Resumen';
import { toast } from 'sonner';
import { EspacioDeportivo } from '@/types/espacio';
import { espaciosModel } from '@/models/espaciosModel';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/providers/AuthProvider';

// Pasos del formulario
const PASOS = [
  { id: 'info-basica', titulo: 'Información Básica', icono: 'Info' },
  { id: 'ubicacion', titulo: 'Ubicación', icono: 'Location' },
  { id: 'caracteristicas', titulo: 'Características', icono: 'Features' },
  { id: 'precios', titulo: 'Precios', icono: 'Money' },
  { id: 'horarios', titulo: 'Horarios', icono: 'Calendar' },
  { id: 'imagenes', titulo: 'Imágenes', icono: 'Photos' },
  { id: 'resumen', titulo: 'Confirmación', icono: 'Check' },
];

export default function NuevoEspacioPage() {
  const router = useRouter();
  const [paso, setPaso] = useState(0);
  const [cargando, setCargando] = useState(false);
  const [creado, setCreado] = useState(false);
  const { user } = useAuth(); // Obtener el usuario autenticado
  
  // Estado para guardar todos los datos del espacio deportivo
  const [datosEspacio, setDatosEspacio] = useState<Partial<EspacioDeportivo>>({
    estado_espacio: 'pendiente',
    propietario_id: user?.id, // Asignar el ID del usuario como propietario
  });

  // ID del espacio después de crearlo en el paso final
  const [espacioId, setEspacioId] = useState<number | null>(null);

  // Actualizar el propietario_id si cambia el usuario
  useEffect(() => {
    if (user?.id) {
      setDatosEspacio(prev => ({ ...prev, propietario_id: user.id }));
    }
  }, [user]);

  // Función para actualizar los datos del espacio
  const actualizarDatos = (datos: Partial<EspacioDeportivo>) => {
    setDatosEspacio(prev => ({ ...prev, ...datos }));
  };

  // Función para avanzar al siguiente paso
  const siguientePaso = () => {
    if (paso < PASOS.length - 1) {
      setPaso(paso + 1);
      window.scrollTo(0, 0);
    }
  };

  // Función para retroceder al paso anterior
  const pasoAnterior = () => {
    if (paso > 0) {
      setPaso(paso - 1);
      window.scrollTo(0, 0);
    }
  };

  // Función para crear el espacio en el paso final
  const crearEspacio = async () => {
    setCargando(true);
    
    // Verificar que el usuario esté autenticado
    if (!user?.id) {
      toast.error('Debes iniciar sesión para crear un espacio deportivo');
      setCargando(false);
      return;
    }
    
    try {
      // Crear espacio básico
      const { data: nuevoEspacio, error } = await espaciosModel.createEspacio({
        propietario_id: user.id, // Usar el ID del usuario autenticado
        nombre: datosEspacio.nombre,
        tipo: datosEspacio.tipo,
        descripcion: datosEspacio.descripcion,
        direccion: datosEspacio.direccion,
        ciudad: datosEspacio.ciudad,
        estado: datosEspacio.estado,
        codigo_postal: datosEspacio.codigo_postal,
        latitud: datosEspacio.latitud,
        longitud: datosEspacio.longitud,
        precio_base: datosEspacio.precio_base,
        precio_hora: datosEspacio.precio_hora,
        capacidad_min: datosEspacio.capacidad_min,
        capacidad_max: datosEspacio.capacidad_max,
        duracion_turno: datosEspacio.duracion_turno,
        imagen_principal: datosEspacio.imagen_principal,
        estado_espacio: 'pendiente',
      });

      if (error) throw new Error('Error al crear el espacio deportivo');
      
      const espacioCreado = nuevoEspacio as EspacioDeportivo;
      setEspacioId(espacioCreado.id);
      
      // Agregar características
      if (datosEspacio.caracteristicas && datosEspacio.caracteristicas.length > 0) {
        await espaciosModel.addCaracteristicas(
          espacioCreado.id,
          datosEspacio.caracteristicas.map(c => ({ nombre: c.nombre, valor: c.valor }))
        );
      }
      
      // Agregar imágenes
      if (datosEspacio.imagenes && datosEspacio.imagenes.length > 0) {
        await espaciosModel.addImagenes(
          espacioCreado.id,
          datosEspacio.imagenes.map(img => ({ url: img.url, orden: img.orden }))
        );
      }
      
      // Agregar horarios
      if (datosEspacio.horarios && datosEspacio.horarios.length > 0) {
        await espaciosModel.addHorarios(
          espacioCreado.id,
          datosEspacio.horarios.map(h => ({
            dia_semana: h.dia_semana,
            hora_inicio: h.hora_inicio,
            hora_fin: h.hora_fin,
            disponible: h.disponible,
            precio_especial: h.precio_especial
          }))
        );
      }
      
      setCreado(true);
      toast.success('¡Espacio deportivo creado con éxito!');
      
    } catch (error) {
      console.error('Error al crear espacio:', error);
      toast.error('Ha ocurrido un error al crear el espacio deportivo');
    } finally {
      setCargando(false);
    }
  };

  // Redireccionar después de crear exitosamente
  useEffect(() => {
    if (creado && espacioId) {
      const timer = setTimeout(() => {
        router.push(`/dashboard/espacios/${espacioId}`);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [creado, espacioId, router]);

  // Renderizar el paso actual
  const renderPaso = () => {
    const variants = {
      hidden: { opacity: 0, x: 100 },
      visible: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -100 }
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={paso}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {paso === 0 && (
            <InfoBasica 
              datos={datosEspacio} 
              actualizarDatos={actualizarDatos} 
              siguientePaso={siguientePaso} 
            />
          )}
          {paso === 1 && (
            <UbicacionEspacio 
              datos={datosEspacio} 
              actualizarDatos={actualizarDatos} 
              siguientePaso={siguientePaso} 
              pasoAnterior={pasoAnterior} 
            />
          )}
          {paso === 2 && (
            <Caracteristicas 
              datos={datosEspacio} 
              actualizarDatos={actualizarDatos} 
              siguientePaso={siguientePaso} 
              pasoAnterior={pasoAnterior} 
            />
          )}
          {paso === 3 && (
            <Precios 
              datos={datosEspacio} 
              actualizarDatos={actualizarDatos} 
              siguientePaso={siguientePaso} 
              pasoAnterior={pasoAnterior} 
            />
          )}
          {paso === 4 && (
            <Horarios 
              datos={datosEspacio} 
              actualizarDatos={actualizarDatos} 
              siguientePaso={siguientePaso} 
              pasoAnterior={pasoAnterior} 
            />
          )}
          {paso === 5 && (
            <Imagenes 
              datos={datosEspacio} 
              actualizarDatos={actualizarDatos} 
              siguientePaso={siguientePaso} 
              pasoAnterior={pasoAnterior} 
            />
          )}
          {paso === 6 && (
            <Resumen 
              datos={datosEspacio} 
              crearEspacio={crearEspacio} 
              pasoAnterior={pasoAnterior}
              cargando={cargando}
              creado={creado}
            />
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-2 pt-1 pb-4">
      {/* Stepper para mostrar el progreso */}
      <CreacionEspacioStepper 
        pasos={PASOS} 
        pasoActual={paso} 
        irAPaso={(index) => {
          // Solo permitir ir a pasos anteriores o el actual
          if (index <= paso) {
            setPaso(index);
          }
        }} 
      />
      
      {/* Contenedor del formulario actual */}
      <div className="mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 md:p-5">
        {renderPaso()}
      </div>
    </div>
  );
} 