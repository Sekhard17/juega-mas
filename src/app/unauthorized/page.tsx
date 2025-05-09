import { Metadata } from 'next';
import ErrorPage from '@/components/shared/ErrorPage';

export const metadata: Metadata = {
  title: 'Acceso no autorizado | Juega Más',
  description: 'No tienes permisos para acceder a esta página.',
};

export default function Unauthorized() {
  const lockIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-24 w-24 mx-auto">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-4V9a3 3 0 00-3-3H6a3 3 0 00-3 3v4m18-3v2a3 3 0 01-3 3h-4a3 3 0 01-3-3v-2" />
    </svg>
  );

  return (
    <ErrorPage
      title="Acceso no autorizado"
      message="Lo sentimos, no tienes permisos para acceder a esta página. Por favor, inicia sesión o contacta al administrador."
      code="401"
      primaryActionText="Iniciar sesión"
      primaryActionHref="/auth/login"
      secondaryActionText="Volver al inicio"
      secondaryActionHref="/"
      icon={lockIcon}
    />
  );
} 