import { NextRequest, NextResponse } from 'next/server';
import { userModel, UpdateProfileData } from '@/models/userModel';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // Verificar autenticación
    const authResult = await getAuthenticatedUser(req);
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Devolver datos del usuario autenticado
    return NextResponse.json({ 
      status: 'success',
      user: authResult.user 
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return NextResponse.json(
      { error: 'Error al obtener información de perfil' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Verificar autenticación
    const authResult = await getAuthenticatedUser(req);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener datos de la solicitud
    const data: UpdateProfileData = await req.json();
    
    // Actualizar perfil
    const updatedUser = await userModel.updateProfile(authResult.user.id, data);
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Error al actualizar el perfil' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: 'success',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return NextResponse.json(
      { error: 'Error al actualizar información de perfil' },
      { status: 500 }
    );
  }
} 