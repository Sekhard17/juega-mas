"use client";

import { FC, useEffect, useState } from "react";
import { FiltrosEspacios as FiltrosType } from "@/types/espacio";
import { 
  AdjustmentsHorizontalIcon, 
  XMarkIcon, 
  ChevronDownIcon,
  PlusIcon,
  MinusIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { espaciosModel } from "@/models/espaciosModel";
import { motion, AnimatePresence } from "framer-motion";

interface FiltrosEspaciosProps {
  filtros: FiltrosType;
  onChange: (nuevosFiltros: Partial<FiltrosType>) => void;
  compactMode?: boolean;
}

export const FiltrosEspacios: FC<FiltrosEspaciosProps> = ({ 
  filtros, 
  onChange,
  compactMode = false
}) => {
  const [ciudades, setCiudades] = useState<string[]>([]);
  const [tiposEspacios, setTiposEspacios] = useState<string[]>([]);
  const [caracteristicas, setCaracteristicas] = useState<string[]>([]);
  const [cargando, setCargando] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    tipo: true,
    ubicacion: true,
    precio: true,
    ordenar: true
  });

  // Cargar datos para los filtros
  useEffect(() => {
    const cargarDatosFiltros = async () => {
      setCargando(true);
      try {
        // Cargar ciudades
        const ciudadesData = await espaciosModel.obtenerCiudades();
        setCiudades(ciudadesData);
        
        // Cargar tipos de espacios
        const tiposData = await espaciosModel.obtenerTiposEspacios();
        setTiposEspacios(tiposData);
        
        // Cargar características
        const caracteristicasData = await espaciosModel.obtenerCaracteristicas();
        setCaracteristicas(caracteristicasData);
      } catch (error) {
        console.error("Error al cargar datos para filtros:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatosFiltros();
  }, []);

  // Manejar cambio en el campo de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ busqueda: e.target.value });
  };

  // Manejar cambio en los filtros seleccionados
  const handleFiltroChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value === "todos" ? undefined : value });
  };

  // Manejar cambio en los inputs de precios
  const handlePrecioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value === "" ? undefined : parseInt(value, 10);
    onChange({ [name]: numericValue });
  };

  // Manejar cambio en los checkboxes de características
  const handleCaracteristicaChange = (caracteristica: string) => {
    const caracteristicasActuales = filtros.caracteristicas || [];
    const nuevasCaracteristicas = caracteristicasActuales.includes(caracteristica)
      ? caracteristicasActuales.filter((c) => c !== caracteristica)
      : [...caracteristicasActuales, caracteristica];
    
    onChange({ caracteristicas: nuevasCaracteristicas.length ? nuevasCaracteristicas : undefined });
  };

  // Manejar la expansión/colapso de secciones
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Limpiar todos los filtros
  const handleLimpiarFiltros = () => {
    onChange({
      busqueda: "",
      tipo: undefined,
      ciudad: undefined,
      precio_min: undefined,
      precio_max: undefined,
      capacidad_min: undefined,
      ordenar_por: undefined,
      caracteristicas: undefined,
    });
  };

  // Contador de filtros activos
  const contarFiltrosActivos = () => {
    let count = 0;
    if (filtros.tipo) count++;
    if (filtros.ciudad) count++;
    if (filtros.precio_min) count++;
    if (filtros.precio_max) count++;
    if (filtros.capacidad_min) count++;
    if (filtros.ordenar_por) count++;
    if (filtros.caracteristicas?.length) count += filtros.caracteristicas.length;
    return count;
  };

  const filtrosActivos = contarFiltrosActivos();

  // Modificamos la función para que devuelva o bien el componente completo, o bien una versión simplificada
  // si estamos en modo compacto
  
  // Versión en modo compacto (sin animaciones y siempre expandida)
  if (compactMode) {
    return (
      <>
        {/* Tipo de Espacio */}
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
            Tipo de Espacio
          </label>
          <select
            name="tipo"
            value={filtros.tipo || "todos"}
            onChange={handleFiltroChange}
            className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
              focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
          >
            <option value="todos">Todos los tipos</option>
            {tiposEspacios.map((tipo) => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>
        
        {/* Ubicación */}
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
            Ubicación
          </label>
          <select
            name="ciudad"
            value={filtros.ciudad || "todos"}
            onChange={handleFiltroChange}
            className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
              focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
          >
            <option value="todos">Todas las ciudades</option>
            {ciudades.map((ciudad) => (
              <option key={ciudad} value={ciudad}>{ciudad}</option>
            ))}
          </select>
        </div>
        
        {/* Rangos de precio */}
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
            Rango de precio
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-gray-600 dark:text-gray-400">Precio mínimo (CLP)</label>
              <input
                type="number"
                name="precio_min"
                placeholder="Desde"
                value={filtros.precio_min || ""}
                onChange={handlePrecioChange}
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                  bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
                  focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                min="0"
                step="1000"
              />
            </div>
            
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-gray-600 dark:text-gray-400">Precio máximo (CLP)</label>
              <input
                type="number"
                name="precio_max"
                placeholder="Hasta"
                value={filtros.precio_max || ""}
                onChange={handlePrecioChange}
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                  bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
                  focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                min="0"
                step="1000"
              />
            </div>
          </div>
        </div>

        {/* Botón limpiar filtros (modo compacto) */}
        {filtrosActivos > 0 && (
          <div className="col-span-2 mt-4">
            <button
              onClick={handleLimpiarFiltros}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600
                text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700/50
                transition-all duration-200 flex items-center justify-center"
            >
              <XMarkIcon className="h-4 w-4 mr-1.5" />
              Limpiar todos los filtros
              {filtrosActivos > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  {filtrosActivos}
                </span>
              )}
            </button>
          </div>
        )}
      </>
    );
  }

  // Versión completa con secciones colapsables
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tipo de Espacio */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <button 
            className={`w-full px-4 py-3 flex items-center justify-between text-left bg-gray-50 dark:bg-gray-800/80 transition-colors ${
              expandedSections.tipo ? 'border-b border-gray-200 dark:border-gray-700' : ''
            }`}
            onClick={() => toggleSection('tipo')}
          >
            <div className="flex items-center">
              <span className="font-medium text-gray-800 dark:text-white">Tipo de Espacio</span>
              {filtros.tipo && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-emerald-100 dark:bg-emerald-800/60 text-emerald-800 dark:text-emerald-300 rounded-full">
                  {filtros.tipo}
                </span>
              )}
            </div>
            <ChevronDownIcon 
              className={`h-5 w-5 text-gray-500 transition-transform ${
                expandedSections.tipo ? 'transform rotate-180' : ''
              }`} 
            />
          </button>
          
          <AnimatePresence initial={false}>
            {expandedSections.tipo && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {tiposEspacios.map((tipo) => (
                      <button
                        key={tipo}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium text-left ${
                          filtros.tipo === tipo
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                        onClick={() => onChange({ tipo: filtros.tipo === tipo ? undefined : tipo })}
                      >
                        {tipo}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Ubicación */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <button 
            className={`w-full px-4 py-3 flex items-center justify-between text-left bg-gray-50 dark:bg-gray-800/80 transition-colors ${
              expandedSections.ubicacion ? 'border-b border-gray-200 dark:border-gray-700' : ''
            }`}
            onClick={() => toggleSection('ubicacion')}
          >
            <div className="flex items-center">
              <span className="font-medium text-gray-800 dark:text-white">Ubicación</span>
              {filtros.ciudad && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-emerald-100 dark:bg-emerald-800/60 text-emerald-800 dark:text-emerald-300 rounded-full">
                  {filtros.ciudad}
                </span>
              )}
            </div>
            <ChevronDownIcon 
              className={`h-5 w-5 text-gray-500 transition-transform ${
                expandedSections.ubicacion ? 'transform rotate-180' : ''
              }`} 
            />
          </button>
          
          <AnimatePresence initial={false}>
            {expandedSections.ubicacion && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4">
                  <select
                    name="ciudad"
                    value={filtros.ciudad || "todos"}
                    onChange={handleFiltroChange}
                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                      bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200
                      focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                  >
                    <option value="todos">Todas las ciudades</option>
                    {ciudades.map((ciudad) => (
                      <option key={ciudad} value={ciudad}>{ciudad}</option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Rango de Precio */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <button 
            className={`w-full px-4 py-3 flex items-center justify-between text-left bg-gray-50 dark:bg-gray-800/80 transition-colors ${
              expandedSections.precio ? 'border-b border-gray-200 dark:border-gray-700' : ''
            }`}
            onClick={() => toggleSection('precio')}
          >
            <div className="flex items-center">
              <span className="font-medium text-gray-800 dark:text-white">Rango de precio</span>
              {(filtros.precio_min || filtros.precio_max) && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-emerald-100 dark:bg-emerald-800/60 text-emerald-800 dark:text-emerald-300 rounded-full">
                  {filtros.precio_min && filtros.precio_max 
                    ? `${filtros.precio_min} - ${filtros.precio_max}`
                    : filtros.precio_min
                    ? `Desde ${filtros.precio_min}`
                    : `Hasta ${filtros.precio_max}`
                  }
                </span>
              )}
            </div>
            <ChevronDownIcon 
              className={`h-5 w-5 text-gray-500 transition-transform ${
                expandedSections.precio ? 'transform rotate-180' : ''
              }`} 
            />
          </button>
          
          <AnimatePresence initial={false}>
            {expandedSections.precio && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Desde (CLP)</label>
                        <input
                          type="number"
                          name="precio_min"
                          placeholder="Mínimo"
                          value={filtros.precio_min || ""}
                          onChange={handlePrecioChange}
                          className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                            bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200
                            focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                          min="0"
                          step="1000"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Hasta (CLP)</label>
                        <input
                          type="number"
                          name="precio_max"
                          placeholder="Máximo"
                          value={filtros.precio_max || ""}
                          onChange={handlePrecioChange}
                          className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                            bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200
                            focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                          min="0"
                          step="1000"
                        />
                      </div>
                    </div>
                    
                    {/* Precios predefinidos */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                          filtros.precio_max === 20000 
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                        onClick={() => onChange({ precio_min: undefined, precio_max: 20000 })}
                      >
                        Hasta $20.000
                      </button>
                      <button
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                          filtros.precio_min === 20000 && filtros.precio_max === 50000
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                        onClick={() => onChange({ precio_min: 20000, precio_max: 50000 })}
                      >
                        $20.000 - $50.000
                      </button>
                      <button
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                          filtros.precio_min === 50000 
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                        onClick={() => onChange({ precio_min: 50000, precio_max: undefined })}
                      >
                        Más de $50.000
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Ordenar por */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <button 
            className={`w-full px-4 py-3 flex items-center justify-between text-left bg-gray-50 dark:bg-gray-800/80 transition-colors ${
              expandedSections.ordenar ? 'border-b border-gray-200 dark:border-gray-700' : ''
            }`}
            onClick={() => toggleSection('ordenar')}
          >
            <div className="flex items-center">
              <span className="font-medium text-gray-800 dark:text-white">Ordenar por</span>
              {filtros.ordenar_por && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-emerald-100 dark:bg-emerald-800/60 text-emerald-800 dark:text-emerald-300 rounded-full">
                  {filtros.ordenar_por}
                </span>
              )}
            </div>
            <ChevronDownIcon 
              className={`h-5 w-5 text-gray-500 transition-transform ${
                expandedSections.ordenar ? 'transform rotate-180' : ''
              }`} 
            />
          </button>
          
          <AnimatePresence initial={false}>
            {expandedSections.ordenar && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-1">
                  {[
                    { id: "precio_asc" as const, label: "Precio (menor a mayor)" },
                    { id: "precio_desc" as const, label: "Precio (mayor a menor)" },
                    { id: "calificacion" as const, label: "Mejor valorados" },
                    { id: "popularidad" as const, label: "Más recientes" }
                  ].map((opcion) => (
                    <button
                      key={opcion.id}
                      className={`w-full px-3 py-2 rounded-lg text-left ${
                        filtros.ordenar_por === opcion.id
                        ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                      onClick={() => onChange({ ordenar_por: filtros.ordenar_por === opcion.id ? undefined : opcion.id })}
                    >
                      {opcion.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Características */}
        {caracteristicas.length > 0 && (
          <div className="col-span-1 md:col-span-2 mt-4 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden p-4">
            <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-3">Características</h3>
            <div className="flex flex-wrap gap-2">
              {caracteristicas.map((caracteristica) => {
                const isSelected = filtros.caracteristicas?.includes(caracteristica) || false;
                return (
                  <button
                    key={caracteristica}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      isSelected
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => handleCaracteristicaChange(caracteristica)}
                  >
                    {isSelected ? (
                      <span className="flex items-center">
                        <XMarkIcon className="h-3 w-3 mr-1" />
                        {caracteristica}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <PlusIcon className="h-3 w-3 mr-1" />
                        {caracteristica}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 