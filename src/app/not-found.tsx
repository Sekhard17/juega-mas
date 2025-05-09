import { Metadata } from 'next';
import ErrorPage from '@/components/shared/ErrorPage';

export const metadata: Metadata = {
  title: 'Página no encontrada | Juega Más',
  description: 'Lo sentimos, la página que buscas no existe.',
};

export default function NotFound() {
  return (
    <ErrorPage
      title="Página no encontrada"
      message="Lo sentimos, no pudimos encontrar la página que estás buscando."
      code="404"
      primaryActionText="Volver al inicio"
      primaryActionHref="/"
      secondaryActionText="Ir al dashboard"
      secondaryActionHref="/dashboard"
    />
  );
} 