import { NextRequest, NextResponse } from 'next/server';
import { userModel } from '@/models/userModel';
import { getAuthenticatedUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Verificar autenticación
    const authResult = await getAuthenticatedUser(req);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Procesar el formulario multipart
    const formData = await req.formData();
    const photoFile = formData.get('photo') as File;

    if (!photoFile) {
      return NextResponse.json(
        { error: 'No se ha enviado ninguna imagen' },
        { status: 400 }
      );
    }

    // Validar el tipo de archivo
    if (!photoFile.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'El archivo debe ser una imagen' },
        { status: 400 }
      );
    }

    // Validar tamaño (5MB máximo)
    if (photoFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'La imagen no debe exceder los 5MB' },
        { status: 400 }
      );
    }

    // Actualizar foto de perfil
    const photoUrl = await userModel.updateProfilePhoto(authResult.user.id, photoFile);

    if (!photoUrl) {
      return NextResponse.json(
        { error: 'Error al actualizar la foto de perfil' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'success',
      photoUrl
    });
  } catch (error) {
    console.error('Error al actualizar foto de perfil:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
} 