interface UltimosUsuariosTableSkeletonProps {
  className?: string;
}

export default function UltimosUsuariosTableSkeleton({ className = '' }: UltimosUsuariosTableSkeletonProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 ${className}`}>
      {/* Encabezado */}
      <div className="p-6 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded-md mb-2"></div>
        <div className="h-4 w-72 bg-gray-100 dark:bg-gray-700/50 rounded-md"></div>
      </div>

      {/* Tabla */}
      <div className="px-6 pb-6">
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {/* Filas skeleton */}
          {[...Array(5)].map((_, index) => (
            <div key={index} className="py-4 flex items-center gap-4 animate-pulse">
              {/* Avatar skeleton */}
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              
              {/* Contenido skeleton */}
              <div className="flex-1">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded-md mb-2"></div>
                <div className="h-3 w-24 bg-gray-100 dark:bg-gray-700/50 rounded-md"></div>
              </div>

              {/* Badge skeleton */}
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 