'use client';

import { CheckIcon } from '@heroicons/react/24/solid';
import {
  InformationCircleIcon,
  MapPinIcon,
  AdjustmentsVerticalIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  PhotoIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface Paso {
  id: string;
  titulo: string;
  icono: string;
}

interface CreacionEspacioStepperProps {
  pasos: Paso[];
  pasoActual: number;
  irAPaso: (index: number) => void;
}

export default function CreacionEspacioStepper({
  pasos,
  pasoActual,
  irAPaso
}: CreacionEspacioStepperProps) {
  // Función para obtener el icono correspondiente
  const obtenerIcono = (iconoNombre: string) => {
    switch (iconoNombre) {
      case 'Info':
        return <InformationCircleIcon className="w-6 h-6" />;
      case 'Location':
        return <MapPinIcon className="w-6 h-6" />;
      case 'Features':
        return <AdjustmentsVerticalIcon className="w-6 h-6" />;
      case 'Money':
        return <CurrencyDollarIcon className="w-6 h-6" />;
      case 'Calendar':
        return <CalendarDaysIcon className="w-6 h-6" />;
      case 'Photos':
        return <PhotoIcon className="w-6 h-6" />;
      case 'Check':
        return <CheckCircleIcon className="w-6 h-6" />;
      default:
        return <InformationCircleIcon className="w-6 h-6" />;
    }
  };

  return (
    <div className="w-full overflow-x-auto py-2">
      <ol className="flex items-center min-w-max">
        {pasos.map((paso, index) => {
          // Determinar el estado del paso: completado, activo o futuro
          const estaCompletado = index < pasoActual;
          const esActivo = index === pasoActual;
          const esFuturo = index > pasoActual;

          return (
            <li key={paso.id} className="relative flex items-center">
              {/* Línea conectora - excepto para el primer elemento */}
              {index > 0 && (
                <div 
                  className={`flex-1 h-0.5 w-10 md:w-24 ${
                    estaCompletado ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                />
              )}

              {/* Contenedor del paso - círculo y texto */}
              <div 
                className={`flex flex-col items-center cursor-pointer ${
                  esFuturo ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => !esFuturo && irAPaso(index)}
              >
                {/* Círculo del paso */}
                <div 
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                    estaCompletado 
                      ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400' 
                      : esActivo 
                        ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 dark:ring-emerald-900/40' 
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {estaCompletado ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CheckIcon className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    obtenerIcono(paso.icono)
                  )}
                </div>
                
                {/* Título del paso */}
                <span 
                  className={`mt-2 text-xs md:text-sm font-medium ${
                    esActivo 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {paso.titulo}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
} 