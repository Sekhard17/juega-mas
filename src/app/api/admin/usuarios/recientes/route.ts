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

    // Obtener el límite de la consulta
    const url = new URL(req.url);
    const limite = parseInt(url.searchParams.get('limite') || '5', 10);
    
    // Obtener usuarios recientes
    const usuarios = await AdminController.obtenerUsuariosRecientes(limite);
    
    return NextResponse.json({ usuarios });
  } catch (error) {
    console.error('Error al obtener usuarios recientes:', error);
    return NextResponse.json(
      { error: 'Error al obtener usuarios recientes' },
      { status: 500 }
    );
  }
} 