"use client";

import { FC } from "react";

interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
}

interface CategoriasDestacadasProps {
  onCategoriaClick: (categoria: string) => void;
}

export const CategoriasDestacadas: FC<CategoriasDestacadasProps> = ({ onCategoriaClick }) => {
  const categorias: Categoria[] = [
    {
      id: "futbol",
      nombre: "Canchas de Fútbol",
      descripcion: "Canchas de fútbol 5, 7 y 11 jugadores"
    },
    {
      id: "tenis",
      nombre: "Canchas de Tenis",
      descripcion: "Pistas para singles y dobles"
    },
    {
      id: "padel",
      nombre: "Canchas de Pádel",
      descripcion: "El deporte de moda al alcance de tu mano"
    },
    {
      id: "piscinas",
      nombre: "Piscinas",
      descripcion: "Nada y entrena en las mejores piscinas"
    },
    {
      id: "gimnasios",
      nombre: "Gimnasios",
      descripcion: "Espacios equipados para diferentes entrenamientos"
    },
    {
      id: "multiuso",
      nombre: "Canchas Multiuso",
      descripcion: "Perfectas para diversos deportes en un solo lugar"
    }
  ];

  // Función para generar un color único basado en el ID de la categoría
  const getGradiente = (id: string) => {
    const colores = {
      futbol: "from-emerald-500 to-green-600",
      tenis: "from-amber-500 to-yellow-600",
      padel: "from-blue-500 to-indigo-600",
      piscinas: "from-cyan-500 to-blue-600",
      gimnasios: "from-rose-500 to-pink-600",
      multiuso: "from-purple-500 to-violet-600",
    };
    
    return colores[id as keyof typeof colores] || "from-emerald-500 to-teal-600";
  };

  return (
    <section className="my-10">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        Explora por Categorías
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400 mb-6">
        Encuentra el recinto deportivo perfecto según tus preferencias
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categorias.map((categoria) => (
          <div 
            key={categoria.id}
            onClick={() => onCategoriaClick(categoria.nombre)}
            className="group relative h-56 rounded-xl overflow-hidden shadow-md cursor-pointer transform transition-transform duration-300 hover:-translate-y-1"
          >
            {/* Fondo con gradiente generado */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getGradiente(categoria.id)} opacity-80`}></div>
            
            {/* Patrón decorativo */}
            <div className="absolute inset-0 opacity-20 bg-[url('/images/pattern-bg.png')]"></div>
            
            {/* Overlay con gradiente */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            
            {/* Icono decorativo centrado */}
            <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                {getCategoriaIcon(categoria.id)}
              </div>
            </div>
            
            {/* Contenido */}
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <h3 className="text-xl font-bold mb-1 group-hover:text-emerald-200 transition-colors duration-200">
                {categoria.nombre}
              </h3>
              <p className="text-sm text-white/80">{categoria.descripcion}</p>
              
              <div className="mt-3 inline-flex items-center text-sm font-medium text-emerald-200 group-hover:text-white/90 transition-colors duration-200">
                <span>Explorar</span>
                <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Función para obtener un icono acorde a la categoría
function getCategoriaIcon(id: string) {
  switch (id) {
    case 'futbol':
      return (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
          <path strokeLinecap="round" strokeWidth="1.5" d="M12 3v4M12 21v-4M3 12h4M21 12h-4M7.05 7.05l2.83 2.83M7.05 16.95l2.83-2.83M16.95 7.05l-2.83 2.83M16.95 16.95l-2.83-2.83" />
        </svg>
      );
    case 'tenis':
      return (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v18M3 12h18" />
        </svg>
      );
    case 'padel':
      return (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <rect x="6" y="4" width="12" height="16" rx="1" strokeWidth="1.5" />
          <path strokeLinecap="round" strokeWidth="1.5" d="M10 8h4M10 12h4M10 16h4" />
        </svg>
      );
    case 'piscinas':
      return (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 12h16M4 16h16M13 12c1.5-1.25 3-2 4.5-2 1.5 0 2.75.75 3.5 2M8 8a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
      );
    case 'gimnasios':
      return (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 6h2m2 0h2m2 0h2m2 0h2m2 0h2M3 12h2m2 0h12m2 0h2M3 18h2m2 0h2m2 0h2m2 0h2m2 0h2" />
        </svg>
      );
    case 'multiuso':
      return (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      );
    default:
      return (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-7 7m7-7l-7-7" />
        </svg>
      );
  }
} 