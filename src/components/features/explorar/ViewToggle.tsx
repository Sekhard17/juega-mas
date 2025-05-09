"use client";

import { FC } from "react";
import { ViewMode, saveViewMode } from "@/lib/viewPreference";
import { Squares2X2Icon, TableCellsIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

interface ViewToggleProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export const ViewToggle: FC<ViewToggleProps> = ({ viewMode, onChange }) => {
  const handleToggle = (mode: ViewMode) => {
    onChange(mode);
    saveViewMode(mode);
  };

  return (
    <div className="inline-flex items-center p-1.5 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden">
      {/* Indicator de selección con animación */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-emerald-500/90 to-teal-500/90 rounded-lg shadow-sm z-0 opacity-90"
        initial={false}
        animate={{
          x: viewMode === "cards" ? 0 : '100%',
          width: '50%',
        }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
      />
      
      {/* Botón Tarjetas */}
      <button
        onClick={() => handleToggle("cards")}
        className={`relative z-10 p-2 rounded-lg transition-all flex items-center justify-center w-10 h-8 ${
          viewMode === "cards"
            ? "text-white"
            : "text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400"
        }`}
        title="Ver como tarjetas"
      >
        <Squares2X2Icon className="h-5 w-5" />
        <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Tarjetas
        </span>
      </button>
      
      {/* Botón Tabla */}
      <button
        onClick={() => handleToggle("table")}
        className={`relative z-10 p-2 rounded-lg transition-all flex items-center justify-center w-10 h-8 ${
          viewMode === "table"
            ? "text-white"
            : "text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400"
        }`}
        title="Ver como tabla"
      >
        <TableCellsIcon className="h-5 w-5" />
        <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Tabla
        </span>
      </button>
    </div>
  );
}; 