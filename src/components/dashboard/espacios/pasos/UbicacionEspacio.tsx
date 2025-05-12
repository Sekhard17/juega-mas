'use client';

import { useState, useEffect } from 'react';
import { EspacioDeportivo } from '@/types/espacio';
import { espaciosModel } from '@/models/espaciosModel';

interface UbicacionEspacioProps {
  datos: Partial<EspacioDeportivo>;
  actualizarDatos: (datos: Partial<EspacioDeportivo>) => void;
  siguientePaso: () => void;
  pasoAnterior: () => void;
}

export default function UbicacionEspacio({
  datos,
  actualizarDatos,
  siguientePaso,
  pasoAnterior
}: UbicacionEspacioProps) {
  const [ciudades, setCiudades] = useState<string[]>([]);
  const [cargando, setCargando] = useState(false);
  
  // Estados locales para el formulario
  const [direccion, setDireccion] = useState(datos.direccion || '');
  const [ciudad, setCiudad] = useState(datos.ciudad || '');
  const [estado, setEstado] = useState(datos.estado || '');
  const [codigoPostal, setCodigoPostal] = useState(datos.codigo_postal || '');
  const [latitud, setLatitud] = useState<number | undefined>(datos.latitud);
  const [longitud, setLongitud] = useState<number | undefined>(datos.longitud);
  const [mostrarCoordenadas, setMostrarCoordenadas] = useState(Boolean(datos.latitud && datos.longitud));
  
  // Estado para errores de validación
  const [errores, setErrores] = useState({
    direccion: '',
    ciudad: ''
  });

  // Cargar ciudades disponibles
  useEffect(() => {
    const cargarCiudades = async () => {
      try {
        const listaCiudades = await espaciosModel.obtenerCiudades();
        setCiudades(listaCiudades);
      } catch (error) {
        console.error("Error al cargar ciudades:", error);
      }
    };
    
    cargarCiudades();
  }, []);

  // Validar el formulario
  const validarFormulario = (): boolean => {
    const nuevosErrores = {
      direccion: '',
      ciudad: ''
    };
    
    let esValido = true;
    
    if (!direccion.trim()) {
      nuevosErrores.direccion = 'La dirección es obligatoria';
      esValido = false;
    }
    
    if (!ciudad) {
      nuevosErrores.ciudad = 'Debes seleccionar una ciudad';
      esValido = false;
    }
    
    setErrores(nuevosErrores);
    return esValido;
  };

  // Obtener coordenadas (simulado)
  const obtenerCoordenadas = () => {
    // En una implementación real, aquí usarías una API de geocodificación
    // Por ahora simulamos con coordenadas aleatorias cercanas a una ubicación en España
    const lat = 40.416775 + (Math.random() - 0.5) * 0.1;
    const lng = -3.703790 + (Math.random() - 0.5) * 0.1;
    
    setLatitud(parseFloat(lat.toFixed(6)));
    setLongitud(parseFloat(lng.toFixed(6)));
    setMostrarCoordenadas(true);
  };

  // Manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validarFormulario()) {
      setCargando(true);
      
      // Actualizar datos en el estado principal
      actualizarDatos({
        direccion,
        ciudad,
        estado,
        codigo_postal: codigoPostal,
        latitud,
        longitud
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
          Ubicación del Espacio
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Indica dónde se encuentra tu espacio deportivo para que los usuarios puedan encontrarlo fácilmente.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dirección */}
        <div className="col-span-2">
          <label 
            htmlFor="direccion" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Dirección Completa *
          </label>
          <input
            type="text"
            id="direccion"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            placeholder="Ej: Calle Principal 123, Barrio"
            className={`w-full p-3 border ${
              errores.direccion 
                ? 'border-red-500 dark:border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200`}
          />
          {errores.direccion && (
            <p className="mt-1 text-sm text-red-500">{errores.direccion}</p>
          )}
        </div>

        {/* Ciudad */}
        <div>
          <label 
            htmlFor="ciudad" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Ciudad *
          </label>
          <select
            id="ciudad"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            className={`w-full p-3 border ${
              errores.ciudad 
                ? 'border-red-500 dark:border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200`}
          >
            <option value="">Selecciona una ciudad</option>
            {ciudades.map((nombreCiudad, index) => (
              <option key={index} value={nombreCiudad}>{nombreCiudad}</option>
            ))}
          </select>
          {errores.ciudad && (
            <p className="mt-1 text-sm text-red-500">{errores.ciudad}</p>
          )}
        </div>

        {/* Estado/Provincia */}
        <div>
          <label 
            htmlFor="estado" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Estado/Provincia
          </label>
          <input
            type="text"
            id="estado"
            value={estado || ''}
            onChange={(e) => setEstado(e.target.value)}
            placeholder="Ej: Madrid"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Código Postal */}
        <div>
          <label 
            htmlFor="codigoPostal" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Código Postal
          </label>
          <input
            type="text"
            id="codigoPostal"
            value={codigoPostal || ''}
            onChange={(e) => setCodigoPostal(e.target.value)}
            placeholder="Ej: 28001"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Coordenadas */}
        <div className="col-span-2">
          <div className="flex items-center space-x-2 mb-3">
            <h3 className="text-sm font-medium text-gray-800 dark:text-white">Coordenadas (opcional)</h3>
            <button
              type="button"
              onClick={obtenerCoordenadas}
              className="text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-medium px-2 py-1 rounded transition-colors duration-200 dark:bg-emerald-900/50 dark:hover:bg-emerald-800 dark:text-emerald-300"
            >
              Obtener automáticamente
            </button>
          </div>
          
          {mostrarCoordenadas && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label 
                  htmlFor="latitud" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Latitud
                </label>
                <input
                  type="number"
                  id="latitud"
                  value={latitud || ''}
                  onChange={(e) => setLatitud(e.target.value ? parseFloat(e.target.value) : undefined)}
                  step="0.000001"
                  placeholder="Ej: 40.416775"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div>
                <label 
                  htmlFor="longitud" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Longitud
                </label>
                <input
                  type="number"
                  id="longitud"
                  value={longitud || ''}
                  onChange={(e) => setLongitud(e.target.value ? parseFloat(e.target.value) : undefined)}
                  step="0.000001"
                  placeholder="Ej: -3.703790"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
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