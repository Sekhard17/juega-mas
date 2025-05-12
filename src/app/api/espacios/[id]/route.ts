import { NextResponse } from 'next/server';
import { espaciosModel } from '@/models/espaciosModel';

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
    
    // Obtener el espacio deportivo
    const espacio = await espaciosModel.obtenerEspacio(espacioId);
    
    if (!espacio) {
      return NextResponse.json(
        { error: 'Espacio deportivo no encontrado' },
        { status: 404 }
      );
    }
    
    // Devolver el espacio
    return NextResponse.json(espacio);
  } catch (error) {
    console.error('Error al obtener el espacio deportivo:', error);
    
    return NextResponse.json(
      { error: 'Error al obtener el espacio deportivo' },
      { status: 500 }
    );
  }
} 