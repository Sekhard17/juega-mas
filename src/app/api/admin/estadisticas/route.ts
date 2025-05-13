import { NextRequest, NextResponse } from 'next/server';
import { AdminController } from '@/controllers/adminController';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // Verificar autenticación y rol
    const authResult = await getAuthenticatedUser(req);
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar que el usuario sea administrador
    if (authResult.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso prohibido' }, { status: 403 });
    }

    // Obtener estadísticas
    const estadisticas = await AdminController.obtenerEstadisticas();
    
    return NextResponse.json(estadisticas);
  } catch (error) {
    console.error('Error al obtener estadísticas de administrador:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas de administrador' },
      { status: 500 }
    );
  }
} 