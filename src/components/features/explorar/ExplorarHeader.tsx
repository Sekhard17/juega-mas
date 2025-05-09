"use client";

import { FC, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

interface ExplorarHeaderProps {
  onSearch?: (query: string) => void;
}

export const ExplorarHeader: FC<ExplorarHeaderProps> = ({ onSearch }) => {
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

  return (
    <div className="py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400">
          Explora Recintos Deportivos
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg mt-2 mb-6">
          Encuentra los mejores espacios para practicar tu deporte favorito
        </p>
        
        <form onSubmit={handleSubmit} className="relative max-w-2xl">
          <input
            type="text"
            placeholder="¿Qué tipo de recinto deportivo buscas?"
            value={searchQuery}
            onChange={handleInputChange}
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-zinc-200 dark:border-zinc-700 
              bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary-400
              text-zinc-800 dark:text-zinc-200 shadow-sm text-lg"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
            <MagnifyingGlassIcon className="h-6 w-6" />
          </div>
          <button 
            type="submit" 
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Buscar
          </button>
        </form>
        
        <div className="mt-8 flex flex-wrap gap-2">
          <span className="text-sm font-medium mr-2 text-zinc-500 dark:text-zinc-400">
            Populares:
          </span>
          {["Canchas de fútbol", "Piscinas", "Gimnasios", "Tenis", "Padel"].map((tag) => (
            <button 
              key={tag}
              onClick={() => onSearch && onSearch(tag)}
              className="px-3 py-1 rounded-full text-sm bg-zinc-100 hover:bg-zinc-200 
                dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300
                transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}; 