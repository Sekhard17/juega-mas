'use client';

import { useState, useEffect } from 'react';
import { EspacioDeportivo } from '@/types/espacio';
import { espaciosModel } from '@/models/espaciosModel';

interface InfoBasicaProps {
  datos: Partial<EspacioDeportivo>;
  actualizarDatos: (datos: Partial<EspacioDeportivo>) => void;
  siguientePaso: () => void;
}

export default function InfoBasica({
  datos,
  actualizarDatos,
  siguientePaso
}: InfoBasicaProps) {
  const [tiposEspacios, setTiposEspacios] = useState<string[]>([]);
  const [cargando, setCargando] = useState(false);
  const [tipoPersonalizado, setTipoPersonalizado] = useState('');
  const [mostrarTipoPersonalizado, setMostrarTipoPersonalizado] = useState(false);
  
  // Estado local para el formulario
  const [nombre, setNombre] = useState(datos.nombre || '');
  const [tipo, setTipo] = useState(datos.tipo || '');
  const [descripcion, setDescripcion] = useState(datos.descripcion || '');
  const [capacidadMin, setCapacidadMin] = useState<number | undefined>(datos.capacidad_min);
  const [capacidadMax, setCapacidadMax] = useState<number | undefined>(datos.capacidad_max);
  const [duracionTurno, setDuracionTurno] = useState<number>(datos.duracion_turno || 60);
  
  // Estado para errores de validación
  const [errores, setErrores] = useState({
    nombre: '',
    tipo: '',
    tipoPersonalizado: '',
    capacidadMin: '',
    capacidadMax: '',
    duracionTurno: ''
  });

  // Cargar tipos de espacios disponibles
  useEffect(() => {
    const cargarTiposEspacios = async () => {
      try {
        const tipos = await espaciosModel.obtenerTiposEspacios();
        setTiposEspacios(tipos);
      } catch (error) {
        console.error("Error al cargar tipos de espacios:", error);
      }
    };
    
    cargarTiposEspacios();
  }, []);

  // Manejar cambio en tipo de espacio
  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = e.target.value;
    setTipo(valor);
    
    // Si se selecciona "Otro", mostrar campo personalizado
    if (valor === 'Otro') {
      setMostrarTipoPersonalizado(true);
    } else {
      setMostrarTipoPersonalizado(false);
      setTipoPersonalizado('');
    }
  };

  // Validar el formulario
  const validarFormulario = (): boolean => {
    const nuevosErrores = {
      nombre: '',
      tipo: '',
      tipoPersonalizado: '',
      capacidadMin: '',
      capacidadMax: '',
      duracionTurno: ''
    };
    
    let esValido = true;
    
    if (!nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
      esValido = false;
    }
    
    if (!tipo) {
      nuevosErrores.tipo = 'Debes seleccionar un tipo de espacio';
      esValido = false;
    }
    
    if (tipo === 'Otro' && !tipoPersonalizado.trim()) {
      nuevosErrores.tipoPersonalizado = 'Debes ingresar un tipo de espacio';
      esValido = false;
    }
    
    if (capacidadMin !== undefined && capacidadMax !== undefined && capacidadMin > capacidadMax) {
      nuevosErrores.capacidadMin = 'La capacidad mínima no puede ser mayor que la máxima';
      esValido = false;
    }
    
    if (duracionTurno <= 0) {
      nuevosErrores.duracionTurno = 'La duración del turno debe ser mayor a 0';
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
      
      // Determinar el tipo final (personalizado o seleccionado)
      const tipoFinal = tipo === 'Otro' ? tipoPersonalizado : tipo;
      
      // Actualizar datos en el estado principal
      actualizarDatos({
        nombre,
        tipo: tipoFinal,
        descripcion,
        capacidad_min: capacidadMin,
        capacidad_max: capacidadMax,
        duracion_turno: duracionTurno
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
          Información Básica
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Completa la información básica de tu espacio deportivo. Esta información será visible para todos los usuarios.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre del espacio */}
        <div className="col-span-2">
          <label 
            htmlFor="nombre" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Nombre del Espacio *
          </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Cancha de Fútbol Los Pinos"
            className={`w-full p-3 border ${
              errores.nombre 
                ? 'border-red-500 dark:border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200`}
          />
          {errores.nombre && (
            <p className="mt-1 text-sm text-red-500">{errores.nombre}</p>
          )}
        </div>

        {/* Tipo de espacio */}
        <div className={mostrarTipoPersonalizado ? "mb-0" : ""}>
          <label 
            htmlFor="tipo" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Tipo de Espacio *
          </label>
          <select
            id="tipo"
            value={tipo}
            onChange={handleTipoChange}
            className={`w-full p-3 border ${
              errores.tipo 
                ? 'border-red-500 dark:border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200`}
          >
            <option value="">Selecciona un tipo</option>
            {tiposEspacios.map((tipoEspacio, index) => (
              <option key={index} value={tipoEspacio}>{tipoEspacio}</option>
            ))}
          </select>
          {errores.tipo && (
            <p className="mt-1 text-sm text-red-500">{errores.tipo}</p>
          )}
        </div>

        {/* Tipo personalizado (solo se muestra si se selecciona "Otro") */}
        {mostrarTipoPersonalizado && (
          <div>
            <label 
              htmlFor="tipoPersonalizado" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Especifica el tipo de espacio *
            </label>
            <input
              type="text"
              id="tipoPersonalizado"
              value={tipoPersonalizado}
              onChange={(e) => setTipoPersonalizado(e.target.value)}
              placeholder="Ej: Frontón"
              className={`w-full p-3 border ${
                errores.tipoPersonalizado 
                  ? 'border-red-500 dark:border-red-500' 
                  : 'border-gray-300 dark:border-gray-600'
              } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200`}
            />
            {errores.tipoPersonalizado && (
              <p className="mt-1 text-sm text-red-500">{errores.tipoPersonalizado}</p>
            )}
          </div>
        )}

        {/* Duración del turno */}
        <div>
          <label 
            htmlFor="duracionTurno" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Duración del Turno (minutos) *
          </label>
          <select
            id="duracionTurno"
            value={duracionTurno}
            onChange={(e) => setDuracionTurno(Number(e.target.value))}
            className={`w-full p-3 border ${
              errores.duracionTurno 
                ? 'border-red-500 dark:border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200`}
          >
            <option value="30">30 minutos</option>
            <option value="60">1 hora</option>
            <option value="90">1 hora y 30 minutos</option>
            <option value="120">2 horas</option>
            <option value="150">2 horas y 30 minutos</option>
            <option value="180">3 horas</option>
          </select>
          {errores.duracionTurno && (
            <p className="mt-1 text-sm text-red-500">{errores.duracionTurno}</p>
          )}
        </div>

        {/* Capacidad mínima */}
        <div>
          <label 
            htmlFor="capacidadMin" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Capacidad Mínima (personas)
          </label>
          <input
            type="number"
            id="capacidadMin"
            value={capacidadMin || ''}
            onChange={(e) => setCapacidadMin(e.target.value ? Number(e.target.value) : undefined)}
            placeholder="Ej: 2"
            min="1"
            className={`w-full p-3 border ${
              errores.capacidadMin 
                ? 'border-red-500 dark:border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200`}
          />
          {errores.capacidadMin && (
            <p className="mt-1 text-sm text-red-500">{errores.capacidadMin}</p>
          )}
        </div>

        {/* Capacidad máxima */}
        <div>
          <label 
            htmlFor="capacidadMax" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Capacidad Máxima (personas)
          </label>
          <input
            type="number"
            id="capacidadMax"
            value={capacidadMax || ''}
            onChange={(e) => setCapacidadMax(e.target.value ? Number(e.target.value) : undefined)}
            placeholder="Ej: 22"
            min="1"
            className={`w-full p-3 border ${
              errores.capacidadMax 
                ? 'border-red-500 dark:border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200`}
          />
          {errores.capacidadMax && (
            <p className="mt-1 text-sm text-red-500">{errores.capacidadMax}</p>
          )}
        </div>

        {/* Descripción */}
        <div className="col-span-2">
          <label 
            htmlFor="descripcion" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Descripción
          </label>
          <textarea
            id="descripcion"
            value={descripcion || ''}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={4}
            placeholder="Describe tu espacio deportivo con detalle. Menciona características especiales, superficie, etc."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          type="submit"
          disabled={cargando}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 transition-all text-white rounded-lg font-semibold shadow-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cargando ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            </>
          ) : (
            <>
              Siguiente
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
} 