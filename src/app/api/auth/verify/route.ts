import { NextRequest, NextResponse } from 'next/server';
import { AuthController } from '@/controllers/authController';

export async function GET(req: NextRequest) {
  try {
    // Verificar autenticación
    const user = await AuthController.verifyAuth(req);
    
    if (!user) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (error) {
    console.error('Error al verificar autenticación:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Error al verificar autenticación' },
      { status: 500 }
    );
  }
} 