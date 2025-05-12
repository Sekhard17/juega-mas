import { User } from '@/types/user';

interface CabeceraBienvenidaProps {
  user: User | null;
}

export default function CabeceraBienvenida({ user }: CabeceraBienvenidaProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-full p-2 flex-shrink-0">
        <svg 
          className="w-7 h-7 text-emerald-600 dark:text-emerald-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
          />
        </svg>
      </div>
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-0.5 flex items-center">
          ¡Bienvenido, {user?.nombre || 'Propietario'}!
          <span className="ml-1.5 h-1.5 w-1.5 bg-emerald-500 rounded-full inline-block"></span>
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Gestiona tus espacios deportivos y revisa las estadísticas</p>
      </div>
    </div>
  );
} 