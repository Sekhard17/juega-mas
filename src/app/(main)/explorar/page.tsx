"use client";

import { useEffect, useState } from "react";
import { 
  ListadoEspacios, 
  ViewToggle, 
  FiltrosEspacios
} from "@/components/features/explorar";
import { getViewMode, ViewMode } from "@/lib/viewPreference";
import { FiltrosEspacios as FiltrosType } from "@/types/espacio";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon,
  MapPinIcon,
  AdjustmentsHorizontalIcon
} from "@heroicons/react/24/outline";

export default function ExplorarPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [filtros, setFiltros] = useState<FiltrosType>({
    busqueda: "",
    page: 1,
    per_page: 12,
  });
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showTips, setShowTips] = useState(false);
  
  // Cargar preferencia de vista al iniciar
  useEffect(() => {
    setViewMode(getViewMode());
  }, []);

  // Controlar la capacidad de desplazamiento cuando la modal está abierta
  useEffect(() => {
    if (showFiltersModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showFiltersModal]);
  
  // Función para manejar cambios en los filtros
  const handleFiltrosChange = (nuevosFiltros: Partial<FiltrosType>) => {
    setFiltros((prev) => ({
      ...prev,
      ...nuevosFiltros,
      page: "page" in nuevosFiltros ? nuevosFiltros.page || 1 : 1,
    }));
  };
  
  // Función para manejar cambio de página
  const handlePageChange = (newPage: number) => {
    handleFiltrosChange({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Función para manejar búsqueda
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('busqueda') as string;
    handleFiltrosChange({ busqueda: query });
  };
  
  // Contar filtros activos
  const contarFiltrosActivos = () => {
    let count = 0;
    if (filtros.tipo) count++;
    if (filtros.ciudad) count++;
    if (filtros.precio_min) count++;
    if (filtros.precio_max) count++;
    if (filtros.capacidad_min) count++;
    if (filtros.ordenar_por) count++;
    if (filtros.caracteristicas?.length) count += filtros.caracteristicas.length;
    if (filtros.busqueda) count++;
    return count;
  };
  
  const totalFiltros = contarFiltrosActivos();
  
  // Limpiar todos los filtros
  const handleLimpiarFiltros = () => {
    handleFiltrosChange({
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

  // Aplicar filtros y cerrar modal
  const handleAplicarFiltros = () => {
    setShowFiltersModal(false);
  };
  
  return (
    <main className="py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Encabezado simple y funcional */}
        <div className="flex flex-wrap items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Explorar<span className="text-emerald-500"> espacios deportivos</span>
          </h1>
          <ViewToggle viewMode={viewMode} onChange={setViewMode} />
        </div>
        
        {/* Barra de búsqueda y filtros superior */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md mb-8 overflow-hidden border border-gray-100 dark:border-gray-700">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row">
            {/* Campo de búsqueda */}
            <div className="relative flex-grow p-2">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-emerald-500" />
              </div>
              <input
                type="text"
                name="busqueda"
                placeholder="Buscar por nombre, tipo o ubicación..."
                defaultValue={filtros.busqueda || ""}
                className="w-full pl-11 pr-4 py-3 rounded-lg bg-transparent border border-gray-200 dark:border-gray-700
                  focus:ring-2 focus:ring-emerald-400 focus:border-transparent
                  text-gray-800 dark:text-gray-100"
              />
            </div>
            
            {/* Botón de filtros */}
            <div className="md:border-l border-gray-200 dark:border-gray-700">
              <button 
                type="button"
                onClick={() => setShowFiltersModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-3 h-full w-full md:w-auto
                  hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
              >
                <FunnelIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium text-emerald-700 dark:text-emerald-300">
                  Filtros
                  {totalFiltros > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-emerald-500 text-white">
                      {totalFiltros}
                    </span>
                  )}
                </span>
              </button>
            </div>
            
            {/* Botón de búsqueda */}
            <div className="border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700">
              <button 
                type="submit" 
                className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 h-full
                  bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 
                  text-white font-medium transition-all"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>

        {/* Modal de Filtros */}
        <AnimatePresence>
          {showFiltersModal && (
            <>
              {/* Overlay de fondo */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40"
                onClick={() => setShowFiltersModal(false)}
              />
              
              {/* Contenido de la modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                className="fixed inset-0 m-auto w-full max-w-4xl max-h-[70vh] overflow-hidden
                  bg-white dark:bg-gray-800/95 rounded-xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.25)]
                  dark:shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl z-50 flex"
              >
                {/* Panel principal de filtros */}
                <div className="flex-1 flex flex-col border-r border-gray-200/80 dark:border-gray-700/80">
                  {/* Cabecera */}
                  <div className="p-4 border-b border-gray-200/80 dark:border-gray-700/80">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <AdjustmentsHorizontalIcon className="h-5 w-5 text-emerald-500" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Filtros
                        </h3>
                      </div>
                      <button
                        onClick={() => setShowFiltersModal(false)}
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
                          transition-colors"
                        aria-label="Cerrar"
                      >
                        <XMarkIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Contenido scrolleable */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-4">
                      <div className="w-full">
                        <FiltrosEspacios
                          filtros={filtros}
                          onChange={handleFiltrosChange}
                          compactMode={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Panel de resumen */}
                <div className="w-80 flex flex-col bg-gray-50 dark:bg-gray-900/30">
                  {/* Cabecera del resumen */}
                  <div className="p-4 border-b border-gray-200/80 dark:border-gray-700/80">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <FunnelIcon className="h-4 w-4 text-emerald-500" />
                      Resumen de filtros
                      {totalFiltros > 0 && (
                        <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-emerald-100 dark:bg-emerald-900/30 
                          text-emerald-600 dark:text-emerald-400">
                          {totalFiltros}
                        </span>
                      )}
                    </h4>
                  </div>

                  {/* Contenido del resumen */}
                  <div className="flex-1 p-4">
                    {totalFiltros === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No hay filtros seleccionados
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {filtros.tipo && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Tipo:</span>
                            <span className="font-medium text-gray-900 dark:text-white">{filtros.tipo}</span>
                          </div>
                        )}
                        {filtros.ciudad && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Ciudad:</span>
                            <span className="font-medium text-gray-900 dark:text-white">{filtros.ciudad}</span>
                          </div>
                        )}
                        {(filtros.precio_min || filtros.precio_max) && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Precio:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {filtros.precio_min && filtros.precio_max 
                                ? `$${filtros.precio_min} - $${filtros.precio_max}`
                                : filtros.precio_min
                                ? `Desde $${filtros.precio_min}`
                                : `Hasta $${filtros.precio_max}`
                              }
                            </span>
                          </div>
                        )}
                        {filtros.caracteristicas && filtros.caracteristicas.length > 0 && (
                          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                            <span className="block mb-2 text-sm text-gray-600 dark:text-gray-400">
                              Características:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {filtros.caracteristicas.map(caract => (
                                <span key={caract} className="px-2 py-0.5 bg-emerald-100/80 dark:bg-emerald-900/30 
                                  text-emerald-700 dark:text-emerald-300 rounded-full text-xs">
                                  {caract}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Pie con botones */}
                  <div className="p-4 border-t border-gray-200/80 dark:border-gray-700/80">
                    <div className="flex gap-2">
                      {totalFiltros > 0 ? (
                        <button
                          onClick={handleLimpiarFiltros}
                          className="flex-1 px-3 py-2 text-sm border border-gray-300/80 dark:border-gray-600/80 rounded-lg 
                            text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700/50
                            transition-all duration-200 flex items-center justify-center"
                        >
                          <XMarkIcon className="h-4 w-4 mr-1.5" />
                          Limpiar filtros
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowFiltersModal(false)}
                          className="flex-1 px-3 py-2 text-sm border border-gray-300/80 dark:border-gray-600/80 rounded-lg 
                            text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700/50
                            transition-all duration-200"
                        >
                          Cancelar
                        </button>
                      )}
                      
                      <button
                        onClick={handleAplicarFiltros}
                        disabled={totalFiltros === 0}
                        className={`flex-1 px-3 py-2 text-sm rounded-lg font-medium
                          transition-all duration-200 ${
                            totalFiltros > 0 
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          }`}
                      >
                        {totalFiltros > 0 ? 'Aplicar' : 'Sin filtros seleccionados'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Barra de resultados */}
        {(filtros.busqueda || totalFiltros > 0) && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                {filtros.busqueda 
                  ? (
                    <>
                      <span className="text-emerald-500 dark:text-emerald-400 mr-2">
                        <MagnifyingGlassIcon className="h-5 w-5 inline" />
                      </span>
                      Resultados para "{filtros.busqueda}"
                    </>
                  ) 
                  : filtros.tipo ? (
                    <>
                      <span className="text-emerald-500 dark:text-emerald-400 mr-2">
                        <FunnelIcon className="h-5 w-5 inline" />
                      </span>
                      {filtros.tipo}
                    </>
                  )
                  : totalFiltros > 0 ? (
                    <>
                      <span className="text-emerald-500 dark:text-emerald-400 mr-2">
                        <FunnelIcon className="h-5 w-5 inline" />
                      </span>
                      {totalFiltros} filtros aplicados
                    </>
                  ) : null}
              </h2>
              {filtros.ciudad && (
                <div className="ml-4 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <MapPinIcon className="h-4 w-4 inline mr-1 text-emerald-500" />
                  {filtros.ciudad}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Listado de recintos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <ListadoEspacios
            viewMode={viewMode}
            filtros={filtros}
            onPageChange={handlePageChange}
          />
        </motion.div>
      </div>
    </main>
  );
} 