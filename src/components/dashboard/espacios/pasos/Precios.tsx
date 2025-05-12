'use client';

import { useState } from 'react';
import { EspacioDeportivo } from '@/types/espacio';
import { formatCurrency } from '@/lib/utils';

interface PreciosProps {
  datos: Partial<EspacioDeportivo>;
  actualizarDatos: (datos: Partial<EspacioDeportivo>) => void;
  siguientePaso: () => void;
  pasoAnterior: () => void;
}

export default function Precios({
  datos,
  actualizarDatos,
  siguientePaso,
  pasoAnterior
}: PreciosProps) {
  const [cargando, setCargando] = useState(false);
  
  // Estados locales para el formulario
  const [precioBase, setPrecioBase] = useState<number>(datos.precio_base || 0);
  const [precioHora, setPrecioHora] = useState<number>(datos.precio_hora || 0);
  
  // Estado para errores de validación
  const [errores, setErrores] = useState({
    precioBase: '',
    precioHora: ''
  });

  // Validar el formulario
  const validarFormulario = (): boolean => {
    const nuevosErrores = {
      precioBase: '',
      precioHora: ''
    };
    
    let esValido = true;
    
    if (precioBase < 0) {
      nuevosErrores.precioBase = 'El precio base no puede ser negativo';
      esValido = false;
    }
    
    if (precioHora <= 0) {
      nuevosErrores.precioHora = 'El precio por hora debe ser mayor a 0';
      esValido = false;
    }
    
    setErrores(nuevosErrores);
    return esValido;
  };

  // Manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validarFormulario()) {
      setCargando(true);
      
      // Actualizar datos en el estado principal
      actualizarDatos({
        precio_base: precioBase,
        precio_hora: precioHora
      });
      
      setTimeout(() => {
        setCargando(false);
        siguientePaso();
      }, 500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Precios
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Establece los precios para tu espacio deportivo. El precio base es opcional y el precio por hora es obligatorio.
        </p>
      </div>
      
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
        <h3 className="text-yellow-800 dark:text-yellow-300 font-medium mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
          </svg>
          Información sobre precios
        </h3>
        <ul className="text-sm text-yellow-700 dark:text-yellow-300/80 space-y-1 ml-7 list-disc">
          <li>El <strong>precio base</strong> es un costo adicional único que se cobra independientemente de la duración de la reserva (opcional).</li>
          <li>El <strong>precio por hora</strong> es el costo por cada hora de uso del espacio.</li>
          <li>Posteriormente podrás configurar precios especiales para ciertos días y horarios.</li>
        </ul>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Precio Base */}
        <div>
          <label 
            htmlFor="precioBase" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Precio Base (CLP)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="precioBase"
              value={precioBase}
              onChange={(e) => setPrecioBase(Number(e.target.value))}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={`w-full p-3 pl-7 border ${
                errores.precioBase 
                  ? 'border-red-500 dark:border-red-500' 
                  : 'border-gray-300 dark:border-gray-600'
              } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200`}
            />
          </div>
          {errores.precioBase && (
            <p className="mt-1 text-sm text-red-500">{errores.precioBase}</p>
          )}
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Costo adicional único (opcional)
          </p>
        </div>

        {/* Precio por Hora */}
        <div>
          <label 
            htmlFor="precioHora" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Precio por Hora (CLP) *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="precioHora"
              value={precioHora}
              onChange={(e) => setPrecioHora(Number(e.target.value))}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              className={`w-full p-3 pl-7 border ${
                errores.precioHora 
                  ? 'border-red-500 dark:border-red-500' 
                  : 'border-gray-300 dark:border-gray-600'
              } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200`}
            />
          </div>
          {errores.precioHora && (
            <p className="mt-1 text-sm text-red-500">{errores.precioHora}</p>
          )}
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Costo por cada hora de uso
          </p>
        </div>
      </div>
      
      {/* Resumen de precios */}
      {(precioBase > 0 || precioHora > 0) && (
        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
            Resumen de Precios
          </h3>
          
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-300">Precio base:</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(precioBase)}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-300">Precio por hora:</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(precioHora)}</span>
            </div>
            
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-300">Precio para 1 hora:</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(precioBase + precioHora)}</span>
            </div>
            
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-300">Precio para 2 horas:</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(precioBase + precioHora * 2)}</span>
            </div>
            
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-300">Precio para 3 horas:</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(precioBase + precioHora * 3)}</span>
            </div>
          </div>
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