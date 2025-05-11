import { NextResponse } from 'next/server';
import { ContactoController } from '@/controllers/contactoController';

export async function POST(request: Request) {
  try {
    // Obtener los datos del formulario
    const data = await request.json();
    
    // Procesar el mensaje a través del controlador
    const resultado = await ContactoController.crearMensaje(data);
    
    if (!resultado) {
      return NextResponse.json(
        { error: 'Error al procesar el mensaje de contacto' },
        { status: 400 }
      );
    }

    // Devolver respuesta exitosa
    return NextResponse.json({
      success: true,
      message: 'Mensaje recibido correctamente',
      data: resultado
    });
  } catch (error) {
    console.error('Error en el endpoint de contacto:', error);
    let errorMessage = 'Error al procesar la solicitud';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 