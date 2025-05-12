import { NextResponse } from 'next/server';
import { EstadisticasController } from '@/controllers/estadisticasController';
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

      // Obtenemos el resumen del propietario
      const resumen = await EstadisticasController.obtenerResumenPropietario(user.id);
      
      if (!resumen) {
        return NextResponse.json(
          { error: 'No se encontró información de resumen para este propietario' },
          { status: 404 }
        );
      }
      
      // Devolvemos el resumen
      return NextResponse.json(resumen);
    } catch (jwtError) {
      console.error('Error al verificar el token JWT:', jwtError);
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error en la API de resumen del propietario:', error);
    
    return NextResponse.json(
      { error: 'Error al obtener el resumen del propietario' },
      { status: 500 }
    );
  }
} 