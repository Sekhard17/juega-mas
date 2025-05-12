import { NextResponse } from 'next/server';
import { espaciosModel } from '@/models/espaciosModel';
import { jwtVerify } from 'jose';
import { authModel } from '@/models/authModel';

export async function GET(request: Request) {
  try {
    // Obtener token del header de autorización
    const authHeader = request.headers.get('Authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;

    // Si no hay token, el usuario no está autenticado
    if (!token) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar token JWT
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret_key_fallback');
      const { payload } = await jwtVerify(token, secret);

      // Verificar si el payload tiene un userId
      if (!payload.userId) {
        return NextResponse.json(
          { error: 'Token inválido' },
          { status: 401 }
        );
      }

      // Obtener el usuario desde la base de datos
      const user = await authModel.getUserById(Number(payload.userId));

      if (!user) {
        return NextResponse.json(
          { error: 'Usuario no encontrado' },
          { status: 404 }
        );
      }

      // Verificamos que el usuario sea propietario
      if (user.role !== 'propietario' && user.role !== 'admin') {
        return NextResponse.json(
          { error: 'No tienes permiso para acceder a esta información' },
          { status: 403 }
        );
      }

      // Obtenemos los espacios del propietario
      const { data: espacios, error } = await espaciosModel.getEspaciosByPropietario(user.id);

      if (error) {
        throw error;
      }

      // Devolvemos los espacios
      return NextResponse.json(espacios);

    } catch (error) {
      console.error('Error al verificar token:', error);
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error al obtener espacios del propietario:', error);
    return NextResponse.json(
      { error: 'Error al obtener los espacios' },
      { status: 500 }
    );
  }
} 