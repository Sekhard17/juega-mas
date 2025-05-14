import { UsersIcon, UserGroupIcon, ShieldCheckIcon, UserMinusIcon } from '@heroicons/react/24/outline';

interface UserStatsProps {
  isLoading: boolean;
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = ({ title, value, icon, description, trend }: StatCardProps) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
        {icon}
      </div>
      <div className="ml-5">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <div className="flex items-baseline">
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
          {trend && (
            <span className={`ml-2 text-sm font-medium ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}%
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </div>
  </div>
);

export function UserStats({ isLoading }: UserStatsProps) {
  const stats = [
    {
      title: 'Total Usuarios',
      value: isLoading ? '-' : '1,234',
      icon: <UsersIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      description: 'Usuarios registrados',
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Usuarios Activos',
      value: isLoading ? '-' : '892',
      icon: <UserGroupIcon className="h-6 w-6 text-green-600 dark:text-green-400" />,
      description: 'En el último mes',
      trend: { value: 8, isPositive: true }
    },
    {
      title: 'Administradores',
      value: isLoading ? '-' : '5',
      icon: <ShieldCheckIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
      description: 'Con permisos especiales',
    },
    {
      title: 'Usuarios Inactivos',
      value: isLoading ? '-' : '342',
      icon: <UserMinusIcon className="h-6 w-6 text-red-600 dark:text-red-400" />,
      description: 'Sin actividad > 30 días',
      trend: { value: 3, isPositive: false }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
} 