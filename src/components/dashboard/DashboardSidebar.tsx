'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/components/shared/ThemeProvider';

interface DashboardSidebarProps {
  initialIsOpen?: boolean;
}

export default function DashboardSidebar({ initialIsOpen }: DashboardSidebarProps) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(initialIsOpen !== undefined ? initialIsOpen : true);

  // Sincronizar con la prop initialIsOpen cuando cambie
  useEffect(() => {
    if (initialIsOpen !== undefined) {
      setIsOpen(initialIsOpen);
      
      // Actualizar localStorage
      localStorage.setItem('sidebarState', initialIsOpen ? 'open' : 'closed');
      
      // Actualizar controller
      const sidebarController = document.getElementById('sidebar-controller');
      if (sidebarController) {
        sidebarController.setAttribute('data-open', initialIsOpen.toString());
      }
    }
  }, [initialIsOpen]);

  // Cargar estado de sidebar desde localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarState');
    if (savedState !== null) {
      const isOpenSaved = savedState === 'open';
      setIsOpen(isOpenSaved);
      
      // Actualizar el controlador con el estado cargado
      const sidebarController = document.getElementById('sidebar-controller');
      if (sidebarController) {
        sidebarController.setAttribute('data-open', isOpenSaved.toString());
      }
    }
  }, []);

  // Escuchar el evento del controlador de la barra lateral
  useEffect(() => {
    const sidebarController = document.getElementById('sidebar-controller');
    
    if (sidebarController) {
      const handleSidebarToggle = () => {
        const isOpen = sidebarController.getAttribute('data-open') === 'true';
        setIsOpen(isOpen);
        
        // Guardar en localStorage
        localStorage.setItem('sidebarState', isOpen ? 'open' : 'closed');
      };
      
      // Observar cambios en el atributo data-open
      const observer = new MutationObserver(handleSidebarToggle);
      observer.observe(sidebarController, { attributes: true });
      
      return () => observer.disconnect();
    }
  }, []);

  // Cerrar automáticamente en pantallas pequeñas
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsOpen(false);
        // No guardar en localStorage cuando se cierra por resize
      } else {
        // Recuperar el estado guardado para pantallas grandes
        const savedState = localStorage.getItem('sidebarState');
        if (savedState !== null) {
          setIsOpen(savedState === 'open');
        } else {
          setIsOpen(true);
        }
      }
    };

    // Configuración inicial
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Función para alternar la barra lateral
  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    
    // Guardar en localStorage
    localStorage.setItem('sidebarState', newState ? 'open' : 'closed');
    
    const sidebarController = document.getElementById('sidebar-controller');
    if (sidebarController) {
      sidebarController.setAttribute('data-open', newState.toString());
    }
  };

  // Establecer la variable CSS para el ancho de la sidebar
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty(
        '--sidebar-width', 
        isOpen ? '16rem' : '5rem' // 64px o 20px
      );
    }
  }, [isOpen]);

  // Categorías para cliente con sus enlaces
  const clienteCategories = [
    {
      name: 'Principal',
      links: [
        {
          name: 'Dashboard',
          href: '/dashboard/cliente',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          ),
        },
        {
          name: 'Mi Perfil',
          href: '/dashboard/perfil',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ),
        },
        {
          name: 'Explorar',
          href: '/dashboard/cliente/explorar',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          ),
        },
      ],
    },
    {
      name: 'Reservas',
      links: [
        {
          name: 'Mis Reservas',
          href: '/dashboard/cliente/reservas',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
        },
        {
          name: 'Historial de Reservas',
          href: '/dashboard/cliente/historial',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
      ],
    },
    {
      name: 'Soporte',
      links: [
        {
          name: 'Reportes',
          href: '/dashboard/cliente/reportes',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
        },
        {
          name: 'Reportar un Problema',
          href: '/dashboard/cliente/reportar-problema',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
        },
        {
          name: 'Ayuda',
          href: '/dashboard/cliente/ayuda',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
      ],
    },
  ];

  // Categorías para propietario con sus enlaces
  const propietarioCategories = [
    {
      name: 'Principal',
      links: [
        {
          name: 'Dashboard',
          href: '/dashboard/propietario',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          ),
        },
        {
          name: 'Mi Perfil',
          href: '/dashboard/perfil',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ),
        },
      ],
    },
    {
      name: 'Gestión',
      links: [
        {
          name: 'Mis Espacios',
          href: '/dashboard/propietario/espacios',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          ),
        },
        {
          name: 'Reservas',
          href: '/dashboard/propietario/reservas',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          ),
        },
        {
          name: 'Finanzas',
          href: '/dashboard/propietario/finanzas',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
      ],
    },
  ];

  // Categorías para admin con sus enlaces
  const adminCategories = [
    {
      name: 'Principal',
      links: [
        {
          name: 'Dashboard',
          href: '/dashboard/admin',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          ),
        },
        {
          name: 'Mi Perfil',
          href: '/dashboard/perfil',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ),
        },
      ],
    },
    {
      name: 'Administración',
      links: [
        {
          name: 'Usuarios',
          href: '/dashboard/admin/usuarios',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ),
        },
        {
          name: 'Espacios',
          href: '/dashboard/admin/espacios',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          ),
        },
        {
          name: 'Reportes',
          href: '/dashboard/admin/reportes',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
        },
        {
          name: 'Configuración',
          href: '/dashboard/admin/configuracion',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
        },
      ],
    },
  ];

  // Determinar qué categorías mostrar según el rol
  let roleCategories = clienteCategories; // Default a cliente en lugar de usuario
  
  if (user?.role === 'cliente') {
    roleCategories = clienteCategories;
  } else if (user?.role === 'propietario') {
    roleCategories = propietarioCategories;
  } else if (user?.role === 'admin') {
    roleCategories = adminCategories;
  }

  return (
    <>
      <aside 
        className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 ease-in-out z-50 ${
          isOpen ? 'lg:w-64 w-64' : 'lg:w-20 w-0 -translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full px-3 py-5 overflow-y-auto flex flex-col">
          {/* Logo */}
          <div className="flex justify-center items-center mb-6">
            {isOpen ? (
              <Image
                src={theme === 'dark' ? "/logos/JuegaMasOscuro.png" : "/logos/JuegaMas.png"}
                alt="JuegaMas Logo"
                width={140}
                height={40}
                className="transition-all duration-300"
                priority
              />
            ) : (
              <Image
                src={theme === 'dark' ? "/logos/JuegaMasOscuro.png" : "/logos/JuegaMas.png"}
                alt="JuegaMas Icon"
                width={32}
                height={32}
                className="transition-all duration-300"
                priority
              />
            )}
          </div>
          
          {/* Botón toggle para minimizar/expandir en pantallas grandes */}
          <button 
            onClick={toggleSidebar}
            className="absolute right-0 top-5 translate-x-1/2 hidden lg:flex items-center justify-center w-6 h-6 bg-emerald-500 dark:bg-emerald-600 rounded-full text-white"
            aria-label={isOpen ? "Minimizar sidebar" : "Expandir sidebar"}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              )}
            </svg>
          </button>

          {/* Enlaces por categorías */}
          <div className="space-y-6 flex-1">
            {roleCategories.map((category, index) => (
              <div key={index} className="space-y-2">
                {isOpen && (
                  <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {category.name}
                  </h3>
                )}
                <ul className="space-y-1.5">
                  {category.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className={`group relative flex items-center py-2.5 ${isOpen ? 'px-3' : 'px-2 justify-center'} rounded-lg transition-all duration-200 ${
                          pathname === link.href
                            ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-500 font-medium border-l-4 border-emerald-500'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        aria-label={!isOpen ? link.name : undefined}
                        title={!isOpen ? link.name : undefined}
                      >
                        {/* Indicador de ítem activo */}
                        {!isOpen && pathname === link.href && (
                          <span className="absolute left-0 top-0 w-1 h-full bg-emerald-500 rounded-r"></span>
                        )}
                        <span className={`${pathname === link.href ? 'text-emerald-600 dark:text-emerald-500' : 'text-gray-500 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-500'} transition-colors duration-200 ${!isOpen && pathname === link.href ? 'scale-110' : ''}`}>
                          {link.icon}
                        </span>
                        {isOpen ? (
                          <span className="ml-3 whitespace-nowrap">{link.name}</span>
                        ) : (
                          <span className="sr-only">{link.name}</span>
                        )}
                        
                        {/* Tooltip nativo del navegador con tooltip personalizado como respaldo */}
                        {!isOpen && (
                          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 px-2 py-1 bg-gray-900 dark:bg-gray-800 text-white text-xs font-medium rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity duration-150">
                            {link.name}
                          </div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </aside>
      
      {/* Overlay para cerrar el sidebar en pantallas pequeñas cuando está abierto */}
      <div 
        className={`lg:hidden fixed inset-0 bg-gray-900 bg-opacity-50 z-30 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />
    </>
  );
} 