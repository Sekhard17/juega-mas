"use client";

import { FC, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Image from "next/image";

interface ExplorarPublicHeaderProps {
  onSearch?: (query: string) => void;
}

export const ExplorarPublicHeader: FC<ExplorarPublicHeaderProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const popularTags = [
    "Canchas de fútbol", 
    "Piscinas", 
    "Gimnasios", 
    "Tenis", 
    "Padel",
    "Vóley"
  ];

  return (
    <div className="relative">
      {/* Fondo con gradiente y patrón */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/90 to-teal-700/90 -z-10">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern-bg.png')]"></div>
      </div>

      {/* Círculos decorativos */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-400 rounded-full opacity-20 blur-3xl -z-5"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-400 rounded-full opacity-20 blur-3xl -z-5"></div>

      {/* Contenido */}
      <div className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 text-white">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            <span className="block">Explora los Mejores</span>
            <span className="block text-emerald-200">Recintos Deportivos</span>
          </h1>
          
          <p className="mt-4 md:mt-6 text-lg text-white/90 max-w-2xl mx-auto">
            Encuentra el espacio perfecto para practicar tu deporte favorito con filtros avanzados y reservas sencillas
          </p>
          
          <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto mt-8">
            <div className="relative">
              <input
                type="text"
                placeholder="¿Qué tipo de recinto deportivo buscas?"
                value={searchQuery}
                onChange={handleInputChange}
                className="w-full pl-14 pr-4 py-5 rounded-xl bg-white/90 backdrop-blur-sm 
                  border-0 focus:ring-2 focus:ring-emerald-400 focus:outline-none
                  text-gray-800 shadow-lg text-lg placeholder-gray-500"
              />
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600">
                <MagnifyingGlassIcon className="h-6 w-6" />
              </div>
              <button 
                type="submit" 
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 
                  text-white px-6 py-2.5 rounded-lg transition-all duration-200 shadow-md
                  hover:shadow-lg transform hover:scale-105"
              >
                Buscar
              </button>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              <span className="text-sm font-medium mr-1 text-emerald-100">
                Populares:
              </span>
              {popularTags.map((tag) => (
                <button 
                  key={tag}
                  onClick={(e) => {
                    e.preventDefault();
                    onSearch && onSearch(tag);
                  }}
                  className="px-3 py-1.5 rounded-full text-sm bg-white/20 hover:bg-white/30 
                    text-white transition-all duration-200 backdrop-blur-sm
                    border border-white/10 hover:border-white/20 shadow-sm"
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>

          {/* Estadísticas pequeñas */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-white/10">
              <p className="text-2xl font-bold">500+</p>
              <p className="text-xs text-emerald-100 mt-1 uppercase tracking-wider">Recintos</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-white/10">
              <p className="text-2xl font-bold">10+</p>
              <p className="text-xs text-emerald-100 mt-1 uppercase tracking-wider">Deportes</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-white/10">
              <p className="text-2xl font-bold">4.8</p>
              <p className="text-xs text-emerald-100 mt-1 uppercase tracking-wider">Valoración</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}; 