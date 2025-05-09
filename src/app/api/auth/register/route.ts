import { NextRequest, NextResponse } from 'next/server';
import { AuthController } from '@/controllers/authController';
import { z } from 'zod';

// Esquema de validación
const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  nombre: z.string().min(2, 'El nombre es demasiado corto'),
  telefono: z.string().optional(),
  role: z.enum(['usuario', 'propietario', 'admin']).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Obtener datos del cuerpo de la solicitud
    const body = await req.json();
    
    // Validar datos
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Datos de registro inválidos', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    // Registrar usuario
    const authResult = await AuthController.register(validationResult.data);
    
    if (!authResult) {
      return NextResponse.json(
        { error: 'Error al registrar el usuario' },
        { status: 500 }
      );
    }
    
    // Establecer cookie de autenticación
    const response = NextResponse.json(
      { 
        message: 'Usuario registrado correctamente',
        user: authResult.user 
      },
      { status: 201 }
    );
    
    // Establecer cookie con el token
    AuthController.setAuthCookie(authResult.token, { res: response });
    
    return response;
    
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    let errorMessage = 'Error al registrar el usuario';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 