export default function EstadisticaSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-5 py-4 h-full animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <div className="h-8 w-24 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
          <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        
        <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
    </div>
  );
} 