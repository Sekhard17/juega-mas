import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { User } from '@/types/user';
import { authModel } from '@/models/authModel';

// Obtener usuario autenticado a partir de la cookie JWT
export async function getAuthenticatedUser(req: NextRequest) {
  try {
    // Obtener token de la cookie
    const token = req.cookies.get('authToken')?.value;

    // Si no hay token, el usuario no está autenticado
    if (!token) {
      return { authenticated: false, user: null };
    }

    // Verificar token JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret_key_fallback');
    const { payload } = await jwtVerify(token, secret);

    // Verificar si el payload tiene un userId
    if (!payload.userId) {
      return { authenticated: false, user: null };
    }

    // Obtener el usuario desde la base de datos para asegurar datos actualizados
    const user = await authModel.getUserById(Number(payload.userId));

    // Si no se encuentra el usuario, devolver no autenticado
    if (!user) {
      return { authenticated: false, user: null };
    }

    return {
      authenticated: true,
      user: user as User
    };
  } catch (error) {
    console.error('Error al verificar autenticación:', error);
    return { authenticated: false, user: null };
  }
} 