'use client';

import { useState } from 'react';
import { EspacioDeportivo, HorarioDisponibilidad } from '@/types/espacio';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';

interface HorariosProps {
  datos: Partial<EspacioDeportivo>;
  actualizarDatos: (datos: Partial<EspacioDeportivo>) => void;
  siguientePaso: () => void;
  pasoAnterior: () => void;
}

export default function Horarios({
  datos,
  actualizarDatos,
  siguientePaso,
  pasoAnterior
}: HorariosProps) {
  const [cargando, setCargando] = useState(false);
  
  // Estado local para los horarios
  const [horarios, setHorarios] = useState<Omit<HorarioDisponibilidad, 'id'>[]>(
    datos.horarios?.map(h => ({
      dia_semana: h.dia_semana,
      hora_inicio: h.hora_inicio,
      hora_fin: h.hora_fin,
      disponible: h.disponible,
      precio_especial: h.precio_especial
    })) || []
  );
  
  // Estado para el nuevo horario
  const [nuevoHorario, setNuevoHorario] = useState({
    dia_semana: 1, // Lunes por defecto
    hora_inicio: '08:00',
    hora_fin: '20:00',
    disponible: true,
    precio_especial: undefined as number | undefined
  });
  
  // Estado para mostrar/ocultar el precio especial
  const [mostrarPrecioEspecial, setMostrarPrecioEspecial] = useState(false);
  
  // Nombres de los días de la semana
  const diasSemana = [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ];

  // Agregar un nuevo horario
  const agregarHorario = () => {
    // Validar que la hora de fin sea posterior a la de inicio
    if (nuevoHorario.hora_inicio >= nuevoHorario.hora_fin) {
      alert('La hora de fin debe ser posterior a la hora de inicio');
      return;
    }
    
    // Verificar si hay solapamiento con otros horarios del mismo día
    const solapamiento = horarios.some(h => 
      h.dia_semana === nuevoHorario.dia_semana && (
        (nuevoHorario.hora_inicio >= h.hora_inicio && nuevoHorario.hora_inicio < h.hora_fin) ||
        (nuevoHorario.hora_fin > h.hora_inicio && nuevoHorario.hora_fin <= h.hora_fin) ||
        (nuevoHorario.hora_inicio <= h.hora_inicio && nuevoHorario.hora_fin >= h.hora_fin)
      )
    );
    
    if (solapamiento) {
      alert('El horario se solapa con otro horario existente para el mismo día');
      return;
    }
    
    // Crear nuevo horario sin precio especial si no está habilitado
    const horarioParaAgregar = {
      ...nuevoHorario,
      precio_especial: mostrarPrecioEspecial ? nuevoHorario.precio_especial : undefined
    };
    
    setHorarios([...horarios, horarioParaAgregar]);
    
    // Resetear el formulario de nuevo horario
    setNuevoHorario({
      dia_semana: nuevoHorario.dia_semana,
      hora_inicio: '08:00',
      hora_fin: '20:00',
      disponible: true,
      precio_especial: undefined
    });
    setMostrarPrecioEspecial(false);
  };

  // Eliminar un horario
  const eliminarHorario = (index: number) => {
    setHorarios(horarios.filter((_, i) => i !== index));
  };

  // Manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    
    // Actualizar datos en el estado principal con IDs temporales para los horarios
    actualizarDatos({
      horarios: horarios.map((h, index) => ({
        ...h,
        id: -(index + 1) // IDs negativos temporales, serán reemplazados al guardar en BD
      }))
    });
    
    setTimeout(() => {
      setCargando(false);
      siguientePaso();
    }, 500);
  };

  // Ordenar horarios por día de la semana y hora de inicio
  const horariosOrdenados = [...horarios].sort((a, b) => {
    if (a.dia_semana !== b.dia_semana) {
      return a.dia_semana - b.dia_semana;
    }
    return a.hora_inicio.localeCompare(b.hora_inicio);
  });

  // Animación para las tarjetas de horarios
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Horarios de Disponibilidad
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Configura los horarios en los que tu espacio deportivo estará disponible para reservas.
        </p>
      </div>
      
      {/* Agregar nuevo horario */}
      <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
          Agregar Nuevo Horario
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Día de la semana */}
          <div>
            <label 
              htmlFor="diaSemana" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Día de la semana
            </label>
            <select
              id="diaSemana"
              value={nuevoHorario.dia_semana}
              onChange={(e) => setNuevoHorario({...nuevoHorario, dia_semana: Number(e.target.value)})}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            >
              {diasSemana.map((dia, index) => (
                <option key={index} value={index}>{dia}</option>
              ))}
            </select>
          </div>
          
          {/* Hora inicio */}
          <div>
            <label 
              htmlFor="horaInicio" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Hora de inicio
            </label>
            <input
              type="time"
              id="horaInicio"
              value={nuevoHorario.hora_inicio}
              onChange={(e) => setNuevoHorario({...nuevoHorario, hora_inicio: e.target.value})}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          {/* Hora fin */}
          <div>
            <label 
              htmlFor="horaFin" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Hora de fin
            </label>
            <input
              type="time"
              id="horaFin"
              value={nuevoHorario.hora_fin}
              onChange={(e) => setNuevoHorario({...nuevoHorario, hora_fin: e.target.value})}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
        
        <div className="mt-4 flex flex-col md:flex-row items-start md:items-end gap-4">
          {/* Checkbox para precio especial */}
          <div className="w-full">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="habilitarPrecioEspecial"
                checked={mostrarPrecioEspecial}
                onChange={(e) => setMostrarPrecioEspecial(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300 dark:border-gray-600"
              />
              <label 
                htmlFor="habilitarPrecioEspecial" 
                className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Establecer precio especial para este horario
              </label>
            </div>
            
            {mostrarPrecioEspecial && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="precioEspecial"
                  value={nuevoHorario.precio_especial || ''}
                  onChange={(e) => setNuevoHorario({
                    ...nuevoHorario, 
                    precio_especial: e.target.value ? Number(e.target.value) : undefined
                  })}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  className="w-full p-3 pl-7 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            )}
          </div>
          
          <button
            type="button"
            onClick={agregarHorario}
            className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-1"
          >
            <PlusCircleIcon className="w-5 h-5" />
            <span>Agregar Horario</span>
          </button>
        </div>
      </div>
      
      {/* Lista de horarios */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
          Horarios Configurados
        </h3>
        
        {horarios.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700">
            No has configurado ningún horario todavía
          </p>
        ) : (
          <div className="space-y-4">
            {Object.entries(
              // Agrupar horarios por día
              horariosOrdenados.reduce((acc, horario) => {
                const dia = horario.dia_semana;
                if (!acc[dia]) acc[dia] = [];
                acc[dia].push(horario);
                return acc;
              }, {} as Record<number, typeof horarios>)
            ).map(([dia, horariosDelDia]) => (
              <div key={dia} className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <h4 className="font-medium text-lg text-gray-900 dark:text-white mb-3">
                  {diasSemana[Number(dia)]}
                </h4>
                
                <div className="space-y-3">
                  {horariosDelDia.map((horario, index) => {
                    // Encontrar el índice original para poder eliminarlo correctamente
                    const indexOriginal = horarios.findIndex(
                      h => h.dia_semana === horario.dia_semana && 
                           h.hora_inicio === horario.hora_inicio && 
                           h.hora_fin === horario.hora_fin
                    );
                    
                    return (
                      <motion.div
                        key={`${horario.dia_semana}-${horario.hora_inicio}-${index}`}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-center">
                          <div className="mr-3 w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="font-medium text-gray-800 dark:text-white">
                            {horario.hora_inicio} - {horario.hora_fin}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          {horario.precio_especial !== undefined && (
                            <span className="text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 py-1 px-2 rounded">
                              {formatCurrency(horario.precio_especial)}/hora
                            </span>
                          )}
                          
                          <button
                            type="button"
                            onClick={() => eliminarHorario(indexOriginal)}
                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
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