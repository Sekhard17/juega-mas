'use client';

import { useState, useEffect } from 'react';
import { EspacioDeportivo, Caracteristica } from '@/types/espacio';
import { espaciosModel } from '@/models/espaciosModel';
import { PlusCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface CaracteristicasProps {
  datos: Partial<EspacioDeportivo>;
  actualizarDatos: (datos: Partial<EspacioDeportivo>) => void;
  siguientePaso: () => void;
  pasoAnterior: () => void;
}

export default function Caracteristicas({
  datos,
  actualizarDatos,
  siguientePaso,
  pasoAnterior
}: CaracteristicasProps) {
  const [caracteristicasDisponibles, setCaracteristicasDisponibles] = useState<string[]>([]);
  const [cargando, setCargando] = useState(false);
  const [caracteristicaPersonalizada, setCaracteristicaPersonalizada] = useState('');
  const [mostrarInputPersonalizado, setMostrarInputPersonalizado] = useState(false);
  
  // Estado local para las características seleccionadas
  const [caracteristicas, setCaracteristicas] = useState<Caracteristica[]>(
    datos.caracteristicas || []
  );
  
  // Estado para la nueva característica siendo agregada
  const [nuevaCaracteristica, setNuevaCaracteristica] = useState({
    nombre: '',
    valor: 'si'
  });

  // Cargar las características disponibles desde el modelo
  useEffect(() => {
    const cargarCaracteristicas = async () => {
      try {
        const lista = await espaciosModel.obtenerCaracteristicas();
        setCaracteristicasDisponibles(lista);
      } catch (error) {
        console.error("Error al cargar características:", error);
      }
    };
    
    cargarCaracteristicas();
  }, []);

  // Manejar el cambio en la selección de características
  const handleCaracteristicaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = e.target.value;
    
    if (valor === 'personalizada') {
      setMostrarInputPersonalizado(true);
      setNuevaCaracteristica({...nuevaCaracteristica, nombre: ''});
    } else {
      setMostrarInputPersonalizado(false);
      setNuevaCaracteristica({...nuevaCaracteristica, nombre: valor});
      setCaracteristicaPersonalizada('');
    }
  };

  // Agregar una nueva característica
  const agregarCaracteristica = () => {
    // Determinar el nombre final (seleccionada o personalizada)
    let nombreFinal = mostrarInputPersonalizado ? caracteristicaPersonalizada : nuevaCaracteristica.nombre;
    
    if (!nombreFinal) return;
    
    // Crear un ID temporal único para la nueva característica (será reemplazado al guardar en BD)
    const tempId = Date.now();
    
    const nuevaCarac: Caracteristica = {
      id: tempId,
      nombre: nombreFinal,
      valor: nuevaCaracteristica.valor
    };
    
    setCaracteristicas([...caracteristicas, nuevaCarac]);
    
    // Limpiar formulario
    setNuevaCaracteristica({ nombre: '', valor: 'si' });
    setCaracteristicaPersonalizada('');
    setMostrarInputPersonalizado(false);
  };

  // Eliminar una característica
  const eliminarCaracteristica = (id: number) => {
    setCaracteristicas(caracteristicas.filter(c => c.id !== id));
  };

  // Actualizar el valor de una característica existente
  const actualizarValorCaracteristica = (id: number, nuevoValor: string) => {
    setCaracteristicas(
      caracteristicas.map(c => 
        c.id === id ? { ...c, valor: nuevoValor } : c
      )
    );
  };

  // Manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    
    // Actualizar datos en el estado principal
    actualizarDatos({
      caracteristicas
    });
    
    setTimeout(() => {
      setCargando(false);
      siguientePaso();
    }, 500);
  };

  // Animación para las tarjetas de características
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Características del Espacio
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Selecciona las características que tiene tu espacio deportivo. Esto ayudará a los usuarios a encontrarlo más fácilmente.
        </p>
      </div>
      
      {/* Agregar nuevas características */}
      <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
          Agregar Característica
        </h3>
        
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label 
                htmlFor="nombreCaracteristica" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Nombre
              </label>
              <select
                id="nombreCaracteristica"
                value={nuevaCaracteristica.nombre}
                onChange={handleCaracteristicaChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Selecciona una característica</option>
                {caracteristicasDisponibles.map((nombre, index) => (
                  // No mostrar características que ya están seleccionadas
                  !caracteristicas.some(c => c.nombre === nombre) && 
                  <option key={index} value={nombre}>{nombre}</option>
                ))}
                <option value="personalizada">Agregar característica personalizada</option>
              </select>
            </div>
            
            <div className="w-full md:w-1/3">
              <label 
                htmlFor="valorCaracteristica" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Valor
              </label>
              <select
                id="valorCaracteristica"
                value={nuevaCaracteristica.valor}
                onChange={(e) => setNuevaCaracteristica({...nuevaCaracteristica, valor: e.target.value})}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              >
                <option value="si">Sí</option>
                <option value="no">No</option>
                <option value="parcial">Parcial</option>
              </select>
            </div>
            
            <button
              type="button"
              onClick={agregarCaracteristica}
              disabled={mostrarInputPersonalizado ? !caracteristicaPersonalizada : !nuevaCaracteristica.nombre}
              className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:bg-emerald-400 disabled:cursor-not-allowed flex items-center space-x-1"
            >
              <PlusCircleIcon className="w-5 h-5" />
              <span>Agregar</span>
            </button>
          </div>
          
          {/* Input para característica personalizada */}
          {mostrarInputPersonalizado && (
            <div className="flex-1 mt-2">
              <label 
                htmlFor="caracteristicaPersonalizada" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Característica personalizada
              </label>
              <input
                type="text"
                id="caracteristicaPersonalizada"
                value={caracteristicaPersonalizada}
                onChange={(e) => setCaracteristicaPersonalizada(e.target.value)}
                placeholder="Ej: Barra de hidratación"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Lista de características seleccionadas */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
          Características Seleccionadas ({caracteristicas.length})
        </h3>
        
        {caracteristicas.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700">
            No has agregado ninguna característica todavía
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {caracteristicas.map((carac) => (
              <motion.div
                key={carac.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200 flex justify-between"
              >
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{carac.nombre}</h4>
                  <div className="mt-1">
                    <select
                      value={carac.valor}
                      onChange={(e) => actualizarValorCaracteristica(carac.id, e.target.value)}
                      className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="si">Sí</option>
                      <option value="no">No</option>
                      <option value="parcial">Parcial</option>
                    </select>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => eliminarCaracteristica(carac.id)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
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