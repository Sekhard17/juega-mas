import { NextResponse } from 'next/server';
import { espaciosModel } from '@/models/espaciosModel';
import { FiltrosEspacios } from '@/types/espacio';

export async function GET(request: Request) {
  try {
    // Obtener parámetros de consulta de la URL
    const url = new URL(request.url);
    const params = url.searchParams;
    
    // Construir objeto de filtros
    const filtros: FiltrosEspacios = {
      busqueda: params.get('busqueda') || undefined,
      tipo: params.get('tipo') || undefined,
      ciudad: params.get('ciudad') || undefined,
      precio_min: params.get('precio_min') ? parseInt(params.get('precio_min')!) : undefined,
      precio_max: params.get('precio_max') ? parseInt(params.get('precio_max')!) : undefined,
      capacidad_min: params.get('capacidad_min') ? parseInt(params.get('capacidad_min')!) : undefined,
      ordenar_por: params.get('ordenar_por') as any || undefined,
      page: params.get('page') ? parseInt(params.get('page')!) : 1,
      per_page: params.get('per_page') ? parseInt(params.get('per_page')!) : 10
    };
    
    // Obtener espacios
    const resultado = await espaciosModel.listarEspacios(filtros);
    
    // Devolver resultado
    return NextResponse.json(resultado.espacios);
  } catch (error) {
    console.error('Error al listar espacios:', error);
    return NextResponse.json(
      { error: 'Error al obtener los espacios deportivos' },
      { status: 500 }
    );
  }
} 