import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Registro | JuegaMás',
  description: 'Crea tu cuenta en JuegaMás para reservar espacios deportivos en tiempo real',
};

export default function RegisterLayout({
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