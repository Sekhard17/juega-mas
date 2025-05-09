'use client';

import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/perfil');
    }
  }, [user, loading, router]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <Navbar />
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex-grow"
      >
        {/* Patrón decorativo en la parte superior */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-r from-emerald-500/10 to-teal-600/10 -z-10"></div>
        
        {/* Círculos decorativos */}
        <div className="hidden md:block absolute top-20 right-[10%] w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="hidden md:block absolute top-40 left-[5%] w-72 h-72 bg-teal-600/10 rounded-full blur-3xl -z-10"></div>
        
        {children}
      </motion.main>
      <Footer />
    </div>
  );
} 