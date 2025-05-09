import { NextRequest, NextResponse } from 'next/server';
import { AuthController } from '@/controllers/authController';
import { z } from 'zod';

// Esquema de validación
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

export async function POST(req: NextRequest) {
  try {
    // Obtener datos del cuerpo de la solicitud
    const body = await req.json();
    
    // Validar datos
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Datos de inicio de sesión inválidos', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    // Iniciar sesión
    const authResult = await AuthController.login(validationResult.data);
    
    if (!authResult) {
      return NextResponse.json(
        { error: 'Email o contraseña incorrectos' },
        { status: 401 }
      );
    }
    
    // Establecer cookie de autenticación
    const response = NextResponse.json({
      message: 'Inicio de sesión correcto',
      user: authResult.user,
    });
    
    // Establecer cookie con el token
    AuthController.setAuthCookie(authResult.token, { res: response });
    
    return response;
    
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    let errorMessage = 'Error al iniciar sesión';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 