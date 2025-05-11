import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export const metadata: Metadata = {
  title: 'Contacto | JuegaMás',
  description: 'Contáctanos para cualquier consulta o sugerencia sobre JuegaMás',
};

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <Navbar />
      <main className="flex-grow pt-16">
        {/* Patrón decorativo en la parte superior */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-r from-emerald-500/10 to-teal-600/10 -z-10"></div>
        
        {/* Círculos decorativos */}
        <div className="hidden md:block absolute top-20 right-[10%] w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="hidden md:block absolute top-40 left-[5%] w-72 h-72 bg-teal-600/10 rounded-full blur-3xl -z-10"></div>
        
        {children}
      </main>
      <Footer />
    </div>
  );
} 