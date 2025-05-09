import { NextRequest, NextResponse } from 'next/server';
import { AuthController } from '@/controllers/authController';

export async function POST(req: NextRequest) {
  try {
    // Crear respuesta
    const response = NextResponse.json({
      message: 'Sesión cerrada correctamente',
    });
    
    // Eliminar cookie de autenticación
    AuthController.clearAuthCookie({ res: response });
    
    return response;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return NextResponse.json(
      { error: 'Error al cerrar sesión' },
      { status: 500 }
    );
  }
} 