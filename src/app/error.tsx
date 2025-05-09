'use client';

import { useEffect } from 'react';
import ErrorPage from '@/components/shared/ErrorPage';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Opcional: Reportar el error a un servicio de monitoreo
    console.error('Error de página:', error);
  }, [error]);

  const serverErrorIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-24 w-24 mx-auto">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );

  return (
    <ErrorPage
      title="Algo salió mal"
      message="Lo sentimos, ha ocurrido un error inesperado. Nuestro equipo ha sido notificado."
      code="500"
      primaryActionText="Intentar de nuevo"
      primaryActionHref="#"
      secondaryActionText="Volver al inicio"
      secondaryActionHref="/"
      icon={serverErrorIcon}
    />
  );
} 