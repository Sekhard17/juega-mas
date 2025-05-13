export default function GraficosSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
      {/* Skeleton para el gráfico de líneas */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded-md mb-6"></div>
        <div className="h-[400px] bg-gray-100 dark:bg-gray-700/50 rounded-lg"></div>
      </div>

      {/* Skeleton para el gráfico de barras */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded-md mb-6"></div>
        <div className="h-[400px] bg-gray-100 dark:bg-gray-700/50 rounded-lg"></div>
      </div>
    </div>
  );
} 