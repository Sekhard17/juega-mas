import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar Sesión | JuegaMás',
  description: 'Accede a tu cuenta de JuegaMás para reservar espacios deportivos en tiempo real',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
} 