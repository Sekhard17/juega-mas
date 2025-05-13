'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '../shared/ThemeProvider';

// Iconos personalizados por deporte
const deporteIcons = {
  futbol: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.5 8.5L15 12l-3 3-3-3-0.5-3.5 3-2 3 2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 10.5l1.5 3.5M17 10.5L15.5 14M8.5 17L12 15.5l3.5 1.5" />
    </svg>
  ),
  tenis: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="8" strokeWidth="2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16M4 12h16" />
    </svg>
  ),
  padel: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="6" y="4" width="12" height="16" rx="1" strokeWidth="2" />
      <path strokeLinecap="round" strokeWidth="1.5" d="M9 8h6M9 12h6M9 16h6" />
    </svg>
  ),
  basquet: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="8" strokeWidth="2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.93 4.93L19.07 19.07M19.07 4.93L4.93 19.07" />
    </svg>
  ),
  voley: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v8M8 12h8" />
    </svg>
  ),
  natacion: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12h16M4 16h16M13 12c1.5-1.25 3-2 4.5-2 1.5 0 2.75.75 3.5 2M8 10a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
  ),
  golf: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 12c0 4.14-3.36 7.5-7.5 7.5S4.5 16.14 4.5 12 7.86 4.5 12 4.5s7.5 3.36 7.5 7.5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v8M9 10l3-2 3 2" />
    </svg>
  ),
};

// Tipos de deportes disponibles
const tiposDeporte = [
  { id: 'futbol', nombre: 'Fútbol' },
  { id: 'tenis', nombre: 'Tenis' },
  { id: 'padel', nombre: 'Pádel' },
  { id: 'basquet', nombre: 'Básquetbol' },
  { id: 'voley', nombre: 'Vóley' },
  { id: 'natacion', nombre: 'Natación' },
  { id: 'golf', nombre: 'Golf' },
];

// Ciudades disponibles (simuladas)
const ciudades = [
  'Santiago',
  'Concepción',
  'Viña del Mar',
  'Valparaíso',
  'La Serena',
  'Antofagasta',
  'Puerto Montt',
];

export default function SearchBar() {
  const router = useRouter();
  const { theme } = useTheme();
  const [ubicacion, setUbicacion] = useState('');
  const [deporte, setDeporte] = useState('');
  const [fecha, setFecha] = useState('');
  const [showUbicacionDropdown, setShowUbicacionDropdown] = useState(false);
  const [showDeporteDropdown, setShowDeporteDropdown] = useState(false);
  const ubicacionRef = useRef<HTMLDivElement>(null);
  const deporteRef = useRef<HTMLDivElement>(null);
  
  // Obtener la fecha de mañana como valor predeterminado
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFormatted = tomorrow.toISOString().split('T')[0];
  
  // Manejar clics fuera de los dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ubicacionRef.current && !ubicacionRef.current.contains(event.target as Node)) {
        setShowUbicacionDropdown(false);
      }
      if (deporteRef.current && !deporteRef.current.contains(event.target as Node)) {
        setShowDeporteDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Filtrar ciudades basadas en la entrada del usuario
  const ciudadesFiltradas = ubicacion 
    ? ciudades.filter(ciudad => 
        ciudad.toLowerCase().includes(ubicacion.toLowerCase())
      )
    : ciudades;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construir los parámetros de búsqueda
    const params = new URLSearchParams();
    if (ubicacion) params.append('ubicacion', ubicacion);
    if (deporte) params.append('deporte', deporte);
    if (fecha) params.append('fecha', fecha);
    
    // Navegar a la página de resultados con los parámetros
    router.push(`/espacios?${params.toString()}`);
  };

  // Obtener el ícono del deporte seleccionado
  const getDeporteIcon = (deporteId: string) => {
    return deporteIcons[deporteId as keyof typeof deporteIcons] || (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 relative z-30">
      {/* Efectos de fondo decorativos */}
      <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 to-teal-600/10 rounded-2xl blur-xl -z-10"></div>
      <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl -z-5"></div>
      
      <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-white/30 dark:border-gray-700/30">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row">
          {/* Ubicación */}
          <div ref={ubicacionRef} className="relative flex-1 group">
            <div 
              className={`p-3 cursor-pointer transition-all duration-200 ${
                showUbicacionDropdown ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : 'hover:bg-gray-50/70 dark:hover:bg-gray-700/30'
              }`}
              onClick={() => {
                setShowUbicacionDropdown(!showUbicacionDropdown);
                setShowDeporteDropdown(false);
              }}
            >
              <div className="flex items-center mb-0.5">
                <svg className={`h-4 w-4 mr-2 ${
                  showUbicacionDropdown ? 'text-emerald-500' : 'text-gray-400 group-hover:text-emerald-500'
                } transition-colors duration-200`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <label className={`text-xs font-semibold uppercase tracking-wide ${
                  showUbicacionDropdown ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                } transition-colors duration-200`}>
                  Ubicación
                </label>
              </div>
              <input
                type="text"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="¿Dónde quieres jugar?"
                className="w-full font-medium text-gray-900 dark:text-white bg-transparent border-none focus:ring-0 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 text-sm"
              />
            </div>
            
            {/* Dropdown de ubicaciones */}
            {showUbicacionDropdown && (
              <div className="absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-xl rounded-b-xl z-10 max-h-60 overflow-y-auto border border-gray-100/50 dark:border-gray-700/50 divide-y divide-gray-100/30 dark:divide-gray-700/30">
                {ciudadesFiltradas.length > 0 ? (
                  ciudadesFiltradas.map((ciudad) => (
                    <div 
                      key={ciudad} 
                      className="p-3 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 cursor-pointer transition-colors duration-150"
                      onClick={() => {
                        setUbicacion(ciudad);
                        setShowUbicacionDropdown(false);
                      }}
                    >
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-medium">{ciudad}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-gray-500 dark:text-gray-400 text-center">
                    No se encontraron ubicaciones
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Separador vertical */}
          <div className="hidden md:block w-px bg-gradient-to-b from-gray-100/50 via-gray-300/50 to-gray-100/50 dark:from-gray-700/30 dark:via-gray-600/30 dark:to-gray-700/30 mx-0.5"></div>
          
          {/* Tipo de Deporte */}
          <div ref={deporteRef} className="relative flex-1 group">
            <div 
              className={`p-3 cursor-pointer transition-all duration-200 ${
                showDeporteDropdown ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : 'hover:bg-gray-50/70 dark:hover:bg-gray-700/30'
              }`}
              onClick={() => {
                setShowDeporteDropdown(!showDeporteDropdown);
                setShowUbicacionDropdown(false);
              }}
            >
              <div className="flex items-center mb-0.5">
                {deporte ? (
                  <span className={`h-4 w-4 mr-2 ${
                    showDeporteDropdown ? 'text-emerald-500' : 'text-gray-400 group-hover:text-emerald-500'
                  } transition-colors duration-200`}>
                    {getDeporteIcon(deporte)}
                  </span>
                ) : (
                  <svg className={`h-4 w-4 mr-2 ${
                    showDeporteDropdown ? 'text-emerald-500' : 'text-gray-400 group-hover:text-emerald-500'
                  } transition-colors duration-200`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <label className={`text-xs font-semibold uppercase tracking-wide ${
                  showDeporteDropdown ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                } transition-colors duration-200`}>
                  Deporte
                </label>
              </div>
              <div className="font-medium text-gray-900 dark:text-white text-sm">
                {deporte ? tiposDeporte.find(t => t.id === deporte)?.nombre : 'Selecciona un deporte'}
              </div>
            </div>
            
            {/* Dropdown de deportes */}
            {showDeporteDropdown && (
              <div className="absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-xl rounded-b-xl z-10 max-h-60 overflow-y-auto border border-gray-100/50 dark:border-gray-700/50 divide-y divide-gray-100/30 dark:divide-gray-700/30">
                {tiposDeporte.map((tipo) => (
                  <div 
                    key={tipo.id} 
                    className="p-3 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 cursor-pointer transition-colors duration-150"
                    onClick={() => {
                      setDeporte(tipo.id);
                      setShowDeporteDropdown(false);
                    }}
                  >
                    <div className="flex items-center">
                      <span className="h-5 w-5 text-emerald-500 mr-2">
                        {getDeporteIcon(tipo.id)}
                      </span>
                      <span className="font-medium">{tipo.nombre}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Separador vertical */}
          <div className="hidden md:block w-px bg-gradient-to-b from-gray-100/50 via-gray-300/50 to-gray-100/50 dark:from-gray-700/30 dark:via-gray-600/30 dark:to-gray-700/30 mx-0.5"></div>
          
          {/* Fecha */}
          <div className="relative flex-1 group">
            <div className="p-3 cursor-pointer hover:bg-gray-50/70 dark:hover:bg-gray-700/30 transition-all duration-200">
              <div className="flex items-center mb-0.5">
                <svg className="h-4 w-4 mr-2 text-gray-400 group-hover:text-emerald-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 uppercase tracking-wide transition-colors duration-200">
                  Fecha
                </label>
              </div>
              <input
                type="date"
                value={fecha || tomorrowFormatted}
                onChange={(e) => setFecha(e.target.value)}
                min={tomorrowFormatted}
                className="w-full font-medium text-gray-900 dark:text-white bg-transparent border-none focus:ring-0 focus:outline-none text-sm"
              />
            </div>
          </div>
          
          {/* Botón de búsqueda */}
          <div className="p-1.5 md:p-1.5">
            <button 
              type="submit"
              className="w-full h-full group flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-[1.02]"
            >
              <svg className="h-5 w-5 mr-2 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Buscar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
