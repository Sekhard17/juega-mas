import { NextResponse } from 'next/server';
import { EstadisticasController } from '@/controllers/estadisticasController';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Esperar a que params esté disponible antes de usar sus propiedades
    const { id } = await params;
    const espacioId = parseInt(id);
    
    if (isNaN(espacioId)) {
      return NextResponse.json(
        { error: 'ID de espacio inválido' },
        { status: 400 }
      );
    }
    
    // Obtenemos las tendencias por día y por hora
    const tendenciasDias = await EstadisticasController.obtenerTendenciasDias(espacioId);
    const tendenciasHoras = await EstadisticasController.obtenerTendenciasHoras(espacioId);
    
    // Devolvemos las tendencias
    return NextResponse.json({
      dias: tendenciasDias,
      horas: tendenciasHoras
    });
  } catch (error) {
    console.error('Error en la API de tendencias:', error);
    
    return NextResponse.json(
      { error: 'Error al obtener las tendencias' },
      { status: 500 }
    );
  }
} 