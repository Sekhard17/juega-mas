import { ReactNode } from 'react';

interface EstadisticaCardProps {
  titulo: string;
  icono: ReactNode;
  color: 'blue' | 'green' | 'purple' | 'amber';
  cargando: boolean;
  children: ReactNode;
}

export default function EstadisticaCard({ 
  titulo, 
  icono, 
  color,
  cargando,
  children 
}: EstadisticaCardProps) {
  // Mapeo de colores para los diferentes temas
  const colorMapping = {
    blue: {
      light: {
        bg: 'bg-blue-100',
        iconBg: 'bg-blue-200',
        iconColor: 'text-blue-600',
        hover: 'hover:bg-blue-50',
      },
      dark: {
        bg: 'bg-gray-800/80',
        iconBg: 'bg-blue-900/30',
        iconColor: 'text-blue-500',
        hover: 'hover:bg-gray-800',
      }
    },
    green: {
      light: {
        bg: 'bg-green-100',
        iconBg: 'bg-green-200',
        iconColor: 'text-green-600',
        hover: 'hover:bg-green-50',
      },
      dark: {
        bg: 'bg-gray-800/80',
        iconBg: 'bg-green-900/30',
        iconColor: 'text-green-500',
        hover: 'hover:bg-gray-800',
      }
    },
    purple: {
      light: {
        bg: 'bg-purple-100',
        iconBg: 'bg-purple-200',
        iconColor: 'text-purple-600',
        hover: 'hover:bg-purple-50',
      },
      dark: {
        bg: 'bg-gray-800/80',
        iconBg: 'bg-purple-900/30',
        iconColor: 'text-purple-500',
        hover: 'hover:bg-gray-800',
      }
    },
    amber: {
      light: {
        bg: 'bg-amber-100',
        iconBg: 'bg-amber-200',
        iconColor: 'text-amber-600',
        hover: 'hover:bg-amber-50',
      },
      dark: {
        bg: 'bg-gray-800/80',
        iconBg: 'bg-amber-900/30',
        iconColor: 'text-amber-500',
        hover: 'hover:bg-gray-800',
      }
    }
  };

  return (
    <div 
      className={`
        rounded-xl p-5 shadow-lg transition 
        ${colorMapping[color].light.bg} ${colorMapping[color].light.hover} 
        dark:${colorMapping[color].dark.bg} dark:${colorMapping[color].dark.hover}
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">{titulo}</h3>
        <div className={`
          rounded-full p-2 
          ${colorMapping[color].light.iconBg}
          dark:${colorMapping[color].dark.iconBg}
        `}>
          <div className={`w-5 h-5 ${colorMapping[color].light.iconColor} dark:${colorMapping[color].dark.iconColor}`}>
            {icono}
          </div>
        </div>
      </div>

      {cargando ? (
        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
      ) : (
        <>{children}</>
      )}
    </div>
  );
} 