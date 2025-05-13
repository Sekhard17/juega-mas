import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ClockIcon, ChevronRightIcon, UserCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { API_ROUTES } from '@/lib/apiConfig';
import { Usuario } from '@/models/adminModel';

interface UltimosUsuariosTableProps {
  titulo?: string;
  descripcion?: string;
  className?: string;
  limite?: number;
}

const SkeletonLoader = () => (
  <div className="space-y-4 p-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

export default function UltimosUsuariosTable({
  titulo = "Últimos usuarios registrados",
  descripcion = "Los usuarios más recientes que se han unido a la plataforma",
  className = "",
  limite = 5,
}: UltimosUsuariosTableProps) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        setCargando(true);
        const url = `${API_ROUTES.ADMIN.USUARIOS.RECIENTES}?limite=${limite}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Error al cargar usuarios');
        
        const data = await response.json();
        setUsuarios(data.usuarios || []);
      } catch (err) {
        console.error('Error al cargar usuarios:', err);
        setError('No se pudieron cargar los usuarios');
      } finally {
        setCargando(false);
      }
    };

    cargarUsuarios();
  }, [limite]);

  const formatearFechaRelativa = (fechaStr: string): string => {
    const fecha = new Date(fechaStr);
    const ahora = new Date();
    const diferencia = Math.floor((ahora.getTime() - fecha.getTime()) / 1000);
    
    const intervalos = {
      año: 31536000,
      mes: 2592000,
      semana: 604800,
      día: 86400,
      hora: 3600,
      minuto: 60,
      segundo: 1
    };

    for (const [unidad, segundos] of Object.entries(intervalos)) {
      const intervalo = Math.floor(diferencia / segundos);
      
      if (intervalo >= 1) {
        return `Hace ${intervalo} ${unidad}${intervalo !== 1 ? 's' : ''}`;
      }
    }

    return 'Justo ahora';
  };

  const obtenerColorRol = (rol: string): { border: string; bg: string; text: string } => {
    const colores = {
      admin: {
        border: 'border-purple-500',
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        text: 'text-purple-700 dark:text-purple-300'
      },
      propietario: {
        border: 'border-blue-500',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        text: 'text-blue-700 dark:text-blue-300'
      },
      usuario: {
        border: 'border-emerald-500',
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        text: 'text-emerald-700 dark:text-emerald-300'
      },
      cliente: {
        border: 'border-emerald-500',
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        text: 'text-emerald-700 dark:text-emerald-300'
      }
    };

    return colores[rol as keyof typeof colores] || {
      border: 'border-gray-300',
      bg: 'bg-gray-50 dark:bg-gray-700',
      text: 'text-gray-700 dark:text-gray-300'
    };
  };

  const obtenerIniciales = (nombre: string): string => {
    if (!nombre) return '??';
    const partes = nombre.split(' ');
    return partes.length > 1 
      ? (partes[0][0] + partes[1][0]).toUpperCase()
      : nombre.substring(0, 2).toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden ${className}`}
    >
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <UserCircleIcon className="w-6 h-6 mr-2 text-emerald-500" />
              {titulo}
            </h2>
            {descripcion && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {descripcion}
              </p>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {cargando ? (
          <SkeletonLoader />
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-8 text-center"
          >
            <ExclamationCircleIcon className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-300">{error}</p>
          </motion.div>
        ) : usuarios.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-8 text-center"
          >
            <UserCircleIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-300">No hay usuarios registrados recientemente</p>
          </motion.div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {usuarios.map((usuario, index) => {
              const coloresRol = obtenerColorRol(usuario.role);
              return (
                <motion.div
                  key={usuario.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`relative h-12 w-12 rounded-full overflow-hidden border-2 ${coloresRol.border}`}>
                      {usuario.foto_perfil ? (
                        <Image
                          src={usuario.foto_perfil}
                          alt={usuario.nombre}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className={`${coloresRol.bg} h-full w-full flex items-center justify-center`}>
                          <span className={`text-sm font-semibold ${coloresRol.text}`}>
                            {obtenerIniciales(usuario.nombre)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {usuario.nombre}
                        </p>
                        <span className={`px-2.5 py-0.5 text-xs rounded-full capitalize ${coloresRol.bg} ${coloresRol.text}`}>
                          {usuario.role}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {usuario.email}
                      </p>
                    </div>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center whitespace-nowrap">
                      <ClockIcon className="h-3.5 w-3.5 mr-1" />
                      {formatearFechaRelativa(usuario.created_at)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
        className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
      >
        <a
          href="/dashboard/admin/usuarios"
          className="w-full flex items-center justify-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 
                   text-white font-medium rounded-lg transition-all duration-200 
                   dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:text-white"
        >
          Ver todos los usuarios
          <ChevronRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </a>
      </motion.div>
    </motion.div>
  );
} 