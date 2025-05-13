'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import UserMenu from './UserMenu';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Comprobar si estamos en la página de inicio
  const isHomePage = pathname === '/main/inicio';

  // Efecto para detectar el scroll y cambiar el estilo de la navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Manejar cierre de sesión para móvil
  const handleMobileLogout = async () => {
    await logout();
    toast.success('Sesión cerrada correctamente');
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: 'INICIO', href: '/main/inicio' },
    { name: 'EXPLORAR', href: '/main/explorar' },
    { name: 'CÓMO FUNCIONA', href: '/main/como-funciona' },
    { name: 'CONTACTO', href: '/contacto' },
  ];

  // Renderizar botones de autenticación o el menú de usuario según el estado de la sesión
  const renderAuthButtons = () => {
    if (loading) {
      return (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
        </div>
      );
    }

    if (user) {
      return <UserMenu />;
    }

    return (
      <div className="flex items-center space-x-2">
        <Link
          href="/auth/login"
          className={`group inline-flex items-center px-3.5 py-1.5 rounded-lg text-sm font-medium 
          bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700
          text-white shadow-sm hover:shadow-md transition-all duration-200`}
        >
          <svg 
            className="mr-1.5 h-4 w-4 text-emerald-100 group-hover:animate-pulse" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" 
            />
          </svg>
          Iniciar sesión
        </Link>
        <Link
          href="/auth/register"
          className={`group inline-flex items-center px-3.5 py-1.5 rounded-lg text-sm font-medium
          ${!scrolled && isHomePage 
            ? 'bg-white/20 backdrop-blur-sm text-white border border-white/50 hover:bg-white/30' 
            : 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 border border-emerald-500 dark:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
          } transition-all duration-200`}
        >
          <svg 
            className={`mr-1.5 h-4 w-4 ${!scrolled && isHomePage ? 'text-white' : 'text-emerald-500 dark:text-emerald-400'} group-hover:animate-pulse`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" 
            />
          </svg>
          Registro
        </Link>
      </div>
    );
  };

  // Renderizar botones de autenticación o el menú de usuario para móvil
  const renderMobileAuthButtons = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-4">
          <div className="h-8 w-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
        </div>
      );
    }

    if (user) {
      return (
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            {user.foto_perfil ? (
              <Image
                src={user.foto_perfil}
                alt={user.nombre || 'Usuario'}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover border-2 border-emerald-500"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
                {user.nombre?.charAt(0) || 'U'}
              </div>
            )}
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user.nombre}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Link
              href={user.role === 'admin' ? '/dashboard/admin' : user.role === 'propietario' ? '/dashboard/propietario' : '/dashboard/cliente'}
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/perfil"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Mi perfil
            </Link>
            {user.role === 'propietario' && (
              <Link
                href="/espacios/mis-espacios"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Mis espacios
              </Link>
            )}
            <button
              onClick={handleMobileLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="pt-4 pb-5 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col space-y-3 px-4">
          <Link
            href="/auth/login"
            className="w-full flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-bold rounded-lg text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-sm transition-all duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg 
              className="mr-2 h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" 
              />
            </svg>
            INICIAR SESIÓN
          </Link>
          <Link
            href="/auth/register"
            className="w-full flex justify-center items-center px-4 py-2.5 border border-emerald-500 text-sm font-bold rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg 
              className="mr-2 h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" 
              />
            </svg>
            REGISTRO
          </Link>
        </div>
      </div>
    );
  };

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-md' 
        : 'bg-transparent dark:bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src={theme === 'dark' || (!scrolled && isHomePage) ? '/logos/JuegaMasOscuro.png' : '/logos/JuegaMas.png'}
                  alt="JuegaMás Logo"
                  width={150}
                  height={40}
                  className="h-10 w-auto"
                  priority
                />
              </Link>
            </div>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${
                    pathname === link.href
                      ? `border-emerald-500 ${!scrolled && isHomePage ? 'text-white dark:text-emerald-400' : 'text-emerald-600 dark:text-emerald-400'}`
                      : `border-transparent ${!scrolled && isHomePage ? 'text-white dark:text-gray-300 hover:text-white/80 dark:hover:text-emerald-400' : 'text-gray-700 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400'} hover:border-emerald-300 dark:hover:border-emerald-600`
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold tracking-wider transition-colors duration-200`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${!scrolled && isHomePage ? 'text-white dark:text-gray-300 hover:text-white/80 dark:hover:text-emerald-400' : 'text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400'} focus:outline-none transition-colors duration-200`}
              aria-label="Cambiar tema"
            >
              {theme === 'dark' ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
            
            {/* Botones de autenticación o menú de usuario */}
            {renderAuthButtons()}
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleTheme}
              className={`p-2 mr-2 rounded-full ${!scrolled && isHomePage ? 'text-white dark:text-gray-300 hover:text-white/80 dark:hover:text-emerald-400' : 'text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400'} focus:outline-none transition-colors duration-200`}
              aria-label="Cambiar tema"
            >
              {theme === 'dark' ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${!scrolled && isHomePage ? 'text-white dark:text-gray-300 hover:text-white/80 dark:hover:text-emerald-400 hover:bg-white/10 dark:hover:bg-gray-800' : 'text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-800'} focus:outline-none transition-colors duration-200`}
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menú principal</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden bg-white dark:bg-gray-900 shadow-lg`}>
        <div className="pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${
                pathname === link.href
                  ? 'bg-emerald-50 dark:bg-emerald-900/50 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                  : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-emerald-300 dark:hover:border-emerald-600 hover:text-emerald-600 dark:hover:text-emerald-400'
              } block pl-3 pr-4 py-3 border-l-4 text-base font-bold tracking-wider`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
        
        {/* Autenticación móvil */}
        {renderMobileAuthButtons()}
      </div>
    </nav>
  );
};

export default Navbar;
