import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import UltimosUsuariosTableSkeleton from './UltimosUsuariosTableSkeleton';
import { API_ROUTES } from '@/lib/apiConfig';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  avatar?: string;
  fechaRegistro: string;
}

interface UltimosUsuariosTableProps {
  titulo: string;
  descripcion: string;
  className?: string;
}

export default function UltimosUsuariosTable({ titulo, descripcion, className = '' }: UltimosUsuariosTableProps) {
  const [cargando, setCargando] = useState(true);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        setCargando(true);
        // Aquí irá la llamada a tu API cuando esté lista
        // Por ahora usamos datos de ejemplo
        const usuariosEjemplo = [
          {
            id: '1',
            nombre: 'Ana García',
            email: 'ana.garcia@ejemplo.com',
            rol: 'cliente',
            fechaRegistro: '2024-03-15T14:30:00'
          },
          {
            id: '2',
            nombre: 'Carlos López',
            email: 'carlos.lopez@ejemplo.com',
            rol: 'propietario',
            fechaRegistro: '2024-03-14T16:45:00'
          },
          {
            id: '3',
            nombre: 'María Rodríguez',
            email: 'maria.rodriguez@ejemplo.com',
            rol: 'cliente',
            fechaRegistro: '2024-03-14T10:15:00'
          },
          {
            id: '4',
            nombre: 'Juan Pérez',
            email: 'juan.perez@ejemplo.com',
            rol: 'propietario',
            fechaRegistro: '2024-03-13T09:20:00'
          },
          {
            id: '5',
            nombre: 'Laura Sánchez',
            email: 'laura.sanchez@ejemplo.com',
            rol: 'cliente',
            fechaRegistro: '2024-03-13T08:30:00'
          }
        ];

        // Ordenamos por fecha de registro (más reciente primero) y limitamos a 5
        const usuariosOrdenados = usuariosEjemplo
          .sort((a, b) => new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime())
          .slice(0, 5);

        // Simulamos un delay para ver el skeleton
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUsuarios(usuariosOrdenados);
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
        toast.error('No se pudieron cargar los últimos usuarios');
      } finally {
        setCargando(false);
      }
    };

    cargarUsuarios();
  }, []);

  if (cargando) {
    return <UltimosUsuariosTableSkeleton className={className} />;
  }

  const getRolBadgeClasses = (rol: string) => {
    const baseClasses = 'px-3 py-1 text-xs font-medium rounded-full';
    switch (rol) {
      case 'cliente':
        return `${baseClasses} bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400`;
      case 'propietario':
        return `${baseClasses} bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300`;
    }
  };

  // Función para formatear la fecha relativa
  const formatearFechaRelativa = (fecha: string) => {
    const ahora = new Date();
    const fechaRegistro = new Date(fecha);
    const diferencia = ahora.getTime() - fechaRegistro.getTime();
    const minutos = Math.floor(diferencia / (1000 * 60));
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

    if (minutos < 60) {
      return `Hace ${minutos} minutos`;
    } else if (horas < 24) {
      return `Hace ${horas} horas`;
    } else {
      return `Hace ${dias} días`;
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 ${className}`}>
      {/* Encabezado */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {titulo}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {descripcion}
        </p>
      </div>

      {/* Tabla */}
      <div className="px-6 pb-6">
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {usuarios.map((usuario) => (
            <div key={usuario.id} className="py-4 flex items-center gap-4">
              {/* Avatar */}
              <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                {usuario.avatar ? (
                  <img
                    src={usuario.avatar}
                    alt={usuario.nombre}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <span className="text-emerald-700 dark:text-emerald-400 text-lg font-medium">
                    {usuario.nombre.charAt(0)}
                  </span>
                )}
              </div>

              {/* Información del usuario */}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {usuario.nombre}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {usuario.email}
                  </p>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    • {formatearFechaRelativa(usuario.fechaRegistro)}
                  </span>
                </div>
              </div>

              {/* Badge de rol */}
              <span className={getRolBadgeClasses(usuario.rol)}>
                {usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 