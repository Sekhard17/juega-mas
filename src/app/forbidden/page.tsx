import { Metadata } from 'next';
import ErrorPage from '@/components/shared/ErrorPage';

export const metadata: Metadata = {
  title: 'Acceso prohibido | Juega Más',
  description: 'No tienes permisos suficientes para acceder a esta área.',
};

export default function Forbidden() {
  const forbiddenIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-24 w-24 mx-auto">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
  );

  return (
    <ErrorPage
      title="Acceso prohibido"
      message="Lo sentimos, no tienes permisos suficientes para acceder a esta área. Contacta con el administrador si crees que deberías tener acceso."
      code="403"
      primaryActionText="Ir a mi dashboard"
      primaryActionHref="/dashboard"
      secondaryActionText="Volver al inicio"
      secondaryActionHref="/"
      icon={forbiddenIcon}
    />
  );
} 