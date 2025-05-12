import { NextResponse } from 'next/server';
import { EstadisticasController } from '@/controllers/estadisticasController';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // Obtenemos el ID directamente del objeto params
    const { id } = context.params;
    const espacioId = parseInt(id);
    
    if (isNaN(espacioId)) {
      return NextResponse.json(
        { error: 'ID de espacio inválido' },
        { status: 400 }
      );
    }
    
    // Obtenemos las estadísticas del espacio
    const estadisticas = await EstadisticasController.obtenerEstadisticasEspacio(espacioId);
    
    if (!estadisticas) {
      return NextResponse.json(
        { error: 'No se encontraron estadísticas para este espacio' },
        { status: 404 }
      );
    }
    
    // Devolvemos las estadísticas
    return NextResponse.json(estadisticas);
  } catch (error) {
    console.error('Error en la API de estadísticas:', error);
    
    return NextResponse.json(
      { error: 'Error al obtener las estadísticas' },
      { status: 500 }
    );
  }
} 