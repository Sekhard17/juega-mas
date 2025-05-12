import { ChangeEvent } from 'react';
import { EspacioDeportivo } from '@/types/espacio';

interface SelectorNegocioProps {
  espacios: EspacioDeportivo[];
  espacioSeleccionado: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  cargando: boolean;
}

export default function SelectorNegocio({ 
  espacios, 
  espacioSeleccionado, 
  onChange, 
  cargando 
}: SelectorNegocioProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-lg font-medium text-gray-800 dark:text-white">Selecciona un espacio deportivo</h2>
        <div className="w-full md:w-96">
          <select 
            value={espacioSeleccionado}
            onChange={onChange}
            className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            disabled={cargando || espacios.length === 0}
          >
            {espacios.length === 0 ? (
              <option value="">No tienes espacios registrados</option>
            ) : (
              espacios.map((espacio) => (
                <option key={espacio.id} value={espacio.id}>
                  {espacio.nombre}
                </option>
              ))
            )}
          </select>
        </div>
      </div>
    </div>
  );
} 