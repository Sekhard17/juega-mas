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
    
    // Obtenemos los datos de ocupación del espacio
    const ocupacion = await EstadisticasController.obtenerOcupacionEspacio(espacioId);
    
    if (!ocupacion) {
      return NextResponse.json(
        { error: 'No se encontraron datos de ocupación para este espacio' },
        { status: 404 }
      );
    }
    
    // Devolvemos los datos de ocupación
    return NextResponse.json(ocupacion);
  } catch (error) {
    console.error('Error en la API de ocupación:', error);
    
    return NextResponse.json(
      { error: 'Error al obtener los datos de ocupación' },
      { status: 500 }
    );
  }
} 