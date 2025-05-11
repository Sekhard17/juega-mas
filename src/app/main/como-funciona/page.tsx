import { Metadata } from 'next';
import { HowItWorksContent } from '@/components/como-funciona/HowItWorksContent';

export const metadata: Metadata = {
  title: 'Cómo Funciona | JuegaMás',
  description: 'Descubre cómo funciona JuegaMás, tu plataforma para reservar espacios deportivos de manera fácil y rápida.',
  keywords: 'reservas deportivas, espacios deportivos, canchas, proceso de reserva, guía de uso',
};

export default function ComoFunciona() {
  return (
    <main className="flex-grow pt-20">
      <HowItWorksContent />
    </main>
  );
} 