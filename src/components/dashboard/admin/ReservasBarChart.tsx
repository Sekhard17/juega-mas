import { useTheme } from '@/components/shared/ThemeProvider';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface DatosEspacio {
  tipo: string;
  cantidad: number;
}

interface ReservasBarChartProps {
  datos: DatosEspacio[];
  className?: string;
}

export default function ReservasBarChart({ datos, className = '' }: ReservasBarChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Configuración de colores basada en el tema
  const colors = {
    bar: isDark ? '#10b981' : '#059669', // emerald-500/600
    grid: isDark ? '#374151' : '#e5e7eb', // gray-700/200
    text: isDark ? '#9ca3af' : '#6b7280', // gray-400/500
    tooltip: {
      bg: isDark ? '#1f2937' : '#ffffff', // gray-800/white
      border: isDark ? '#374151' : '#e5e7eb', // gray-700/200
      text: isDark ? '#f3f4f6' : '#111827', // gray-100/900
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`
          p-3 rounded-lg shadow-lg border
          ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
        `}>
          <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
            {label}
          </p>
          <p className={`text-sm ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
            {`${payload[0].value} reservas`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`w-full h-[400px] ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={datos}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={colors.grid}
            opacity={0.5}
          />
          <XAxis
            dataKey="tipo"
            stroke={colors.text}
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <YAxis
            stroke={colors.text}
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
              color: colors.text
            }}
          />
          <Bar
            dataKey="cantidad"
            name="Reservas"
            fill={colors.bar}
            radius={[4, 4, 0, 0]}
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 