import { ReactNode } from 'react';

interface EstadisticaCardProps {
  titulo: string;
  valor: string | number;
  icono: ReactNode;
  color: 'blue' | 'green' | 'purple' | 'amber';
  tendencia?: {
    valor: number;
    esPositiva: boolean;
  };
  descripcion?: string;
  className?: string;
}

export default function EstadisticaCard({
  titulo,
  valor,
  icono,
  color,
  tendencia,
  descripcion,
  className = ''
}: EstadisticaCardProps) {
  const colorClases = {
    blue: 'bg-gradient-to-br from-blue-500/10 to-blue-600/20 dark:from-blue-900/20 dark:to-blue-800/30 border-blue-500/30 dark:border-blue-600/30',
    green: 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 dark:from-emerald-900/20 dark:to-emerald-800/30 border-emerald-500/30 dark:border-emerald-600/30',
    purple: 'bg-gradient-to-br from-purple-500/10 to-purple-600/20 dark:from-purple-900/20 dark:to-purple-800/30 border-purple-500/30 dark:border-purple-600/30',
    amber: 'bg-gradient-to-br from-amber-500/10 to-amber-600/20 dark:from-amber-900/20 dark:to-amber-800/30 border-amber-500/30 dark:border-amber-600/30'
  };

  const iconoColorClases = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-emerald-600 dark:text-emerald-400',
    purple: 'text-purple-600 dark:text-purple-400',
    amber: 'text-amber-600 dark:text-amber-400'
  };

  const tendenciaColorClases = {
    positiva: 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-400',
    negativa: 'bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-400'
  };

  return (
    <div className={`rounded-xl border backdrop-blur-sm ${colorClases[color]} px-5 py-4 h-full ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{titulo}</h3>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/50' : color === 'green' ? 'bg-emerald-100 dark:bg-emerald-900/50' : color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/50' : 'bg-amber-100 dark:bg-amber-900/50'}`}>
          <div className={`w-5 h-5 ${iconoColorClases[color]}`}>
            {icono}
          </div>
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-baseline">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{valor}</h2>
          </div>
          {descripcion && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{descripcion}</p>
          )}
        </div>
        
        {tendencia && (
          <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${tendencia.esPositiva ? tendenciaColorClases.positiva : tendenciaColorClases.negativa}`}>
            <span>
              {tendencia.esPositiva ? '+' : '-'}{Math.abs(tendencia.valor)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
} 