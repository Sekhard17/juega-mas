import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import ReservasLineChart from './ReservasLineChart';
import ReservasBarChart from './ReservasBarChart';
import GraficosSkeleton from './GraficosSkeleton';
import { API_ROUTES } from '@/lib/apiConfig';

interface DatosGraficos {
  datosLinea: {
    fecha: string;
    cantidad: number;
  }[];
  datosBarra: {
    tipo: string;
    cantidad: number;
  }[];
}

export default function GraficosContainer() {
  const [cargando, setCargando] = useState(true);
  const [datos, setDatos] = useState<DatosGraficos>({
    datosLinea: [],
    datosBarra: []
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        // Aquí irá la llamada a tu API cuando esté lista
        // Por ahora usamos datos de ejemplo
        const datosEjemplo = {
          datosLinea: [
            { fecha: '2024-01', cantidad: 65 },
            { fecha: '2024-02', cantidad: 78 },
            { fecha: '2024-03', cantidad: 90 },
            { fecha: '2024-04', cantidad: 81 },
            { fecha: '2024-05', cantidad: 86 },
            { fecha: '2024-06', cantidad: 95 },
          ],
          datosBarra: [
            { tipo: 'Fútbol', cantidad: 120 },
            { tipo: 'Tenis', cantidad: 85 },
            { tipo: 'Básquet', cantidad: 70 },
            { tipo: 'Vóley', cantidad: 45 },
            { tipo: 'Pádel', cantidad: 95 },
          ]
        };

        // Simulamos un delay para ver el skeleton
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDatos(datosEjemplo);
      } catch (error) {
        console.error('Error al cargar datos de gráficos:', error);
        toast.error('No se pudieron cargar los datos de los gráficos');
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  if (cargando) {
    return <GraficosSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de líneas */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Reservas por Mes
        </h3>
        <ReservasLineChart datos={datos.datosLinea} />
      </div>

      {/* Gráfico de barras */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Reservas por Tipo de Espacio
        </h3>
        <ReservasBarChart datos={datos.datosBarra} />
      </div>
    </div>
  );
} 