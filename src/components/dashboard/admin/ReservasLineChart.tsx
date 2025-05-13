import { useTheme } from '@/components/shared/ThemeProvider';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface DatosReserva {
  fecha: string;
  cantidad: number;
}

interface ReservasLineChartProps {
  datos: DatosReserva[];
  className?: string;
}

export default function ReservasLineChart({ datos, className = '' }: ReservasLineChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Configuración de colores basada en el tema
  const colors = {
    stroke: isDark ? '#10b981' : '#059669', // emerald-500/600
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
        <LineChart
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
            dataKey="fecha"
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
          <Line
            type="monotone"
            dataKey="cantidad"
            name="Reservas"
            stroke={colors.stroke}
            strokeWidth={2}
            dot={{
              stroke: colors.stroke,
              strokeWidth: 2,
              r: 4,
              fill: isDark ? '#1f2937' : '#ffffff'
            }}
            activeDot={{
              stroke: colors.stroke,
              strokeWidth: 2,
              r: 6,
              fill: isDark ? '#1f2937' : '#ffffff'
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 