import { User } from '@/types/user';

interface CabeceraBienvenidaAdminProps {
  user: User | null;
}

export default function CabeceraBienvenidaAdmin({ user }: CabeceraBienvenidaAdminProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2 flex-shrink-0">
        <svg 
          className="w-7 h-7 text-blue-600 dark:text-blue-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
          />
        </svg>
      </div>
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-0.5 flex items-center">
          ¡Bienvenido, {user?.nombre || 'Administrador'}!
          <span className="ml-1.5 h-1.5 w-1.5 bg-blue-500 rounded-full inline-block"></span>
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Gestiona la plataforma y supervisa todas las actividades</p>
      </div>
    </div>
  );
} 