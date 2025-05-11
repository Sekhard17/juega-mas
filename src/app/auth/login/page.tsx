'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '../../../components/shared/ThemeProvider';
import ThemeToggle from '../../../components/ui/ThemeToggle';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';

// Lista de dominios de correo permitidos
const DOMINIOS_PERMITIDOS = [
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'outlook.cl',
  'yahoo.com',
  'icloud.com',
  'live.com',
  'msn.com',
  'me.com'
];

// Componente que usa useSearchParams
function LoginForm() {
  const router = useRouter();
  const { theme } = useTheme();
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para errores específicos de cada campo
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  
  // Mostrar mensaje si viene de registro
  useEffect(() => {
    if (searchParams.get('registered')) {
      toast.success('¡Registro exitoso! Ahora puedes iniciar sesión');
    }
  }, [searchParams]);
  
  // Validar correo electrónico
  const validarEmail = (email: string): boolean => {
    if (!email.trim()) {
      setEmailError('El correo electrónico es obligatorio');
      return false;
    }
    
    // Expresión regular para verificar el formato básico del correo
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
      setEmailError('Formato de correo electrónico inválido');
      return false;
    }
    
    // Obtener el dominio del correo
    const dominio = email.split('@')[1].toLowerCase();
    if (!DOMINIOS_PERMITIDOS.includes(dominio)) {
      setEmailError('Correo electrónico no válido');
      return false;
    }
    
    // Limpiar error si todo está bien
    setEmailError('');
    return true;
  };
  
  // Validar contraseña
  const validarPassword = (password: string): boolean => {
    if (!password.trim()) {
      setPasswordError('La contraseña es obligatoria');
      return false;
    }
    
    // Limpiar error si todo está bien
    setPasswordError('');
    return true;
  };
  
  // Manejar cambio de email con validación en tiempo real
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoEmail = e.target.value;
    setEmail(nuevoEmail);
    
    // Solo validamos campos vacíos mientras escribe
    // La validación completa se hará al perder el foco
    if (!nuevoEmail.trim() && emailError) {
      setEmailError('El correo electrónico es obligatorio');
    } else if (nuevoEmail.trim() && emailError) {
      // Si antes había error y ahora hay contenido, quitamos el mensaje
      setEmailError('');
    }
  };
  
  // Manejar cambio de contraseña con validación en tiempo real
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevaPassword = e.target.value;
    setPassword(nuevaPassword);
    
    // Solo validamos si el campo ya no está vacío o si ya tenía un error
    if (nuevaPassword.trim() || passwordError) {
      validarPassword(nuevaPassword);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Limpiar error general
    setGeneralError('');
    
    // Validar todos los campos
    const esEmailValido = validarEmail(email);
    const esPasswordValida = validarPassword(password);
    
    // Si hay errores, no continuar
    if (!esEmailValido || !esPasswordValida) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Usar la función login del AuthProvider
      const success = await login(email, password);
      
      if (success) {
        // Redireccionar al dashboard o la ruta especificada
        console.log('Login exitoso, redirigiendo a:', redirect);
        
        // Pequeño retraso para asegurar que las cookies se establezcan
        setTimeout(() => {
          router.push(redirect);
        }, 300);
      } else {
        setGeneralError('Email o contraseña incorrectos');
      }
    } catch (err) {
      setGeneralError('Error al iniciar sesión. Por favor, intenta nuevamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {generalError && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-xl text-sm flex items-start">
          <svg className="h-5 w-5 flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{generalError}</span>
        </div>
      )}
      
      <div className="group">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors">
          Correo electrónico
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <input
            id="email"
            name="email"
            type="text" // Cambiado de email a text para evitar validación nativa
            autoComplete="email"
            value={email}
            onChange={handleEmailChange}
            onBlur={() => validarEmail(email)} // Validar al perder foco
            className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
              emailError ? 'border-red-500 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
            } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700/80 dark:text-white text-sm transition-all duration-200`}
            placeholder="tu@email.com"
          />
        </div>
        {emailError && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{emailError}</p>
        )}
      </div>

      <div className="group">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors">
          Contraseña
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={handlePasswordChange}
            onBlur={() => validarPassword(password)} // Validar al perder foco
            className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
              passwordError ? 'border-red-500 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
            } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700/80 dark:text-white text-sm transition-all duration-200`}
            placeholder="********"
          />
        </div>
        {passwordError && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{passwordError}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember_me"
            name="remember_me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
          />
          <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Recordarme
          </label>
        </div>

        <div className="text-sm">
          <Link href="/auth/forgot-password" className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-200">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 ${
            isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:-translate-y-0.5'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Iniciando sesión...
            </>
          ) : (
            'Iniciar sesión'
          )}
        </button>
      </div>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            o continúa con
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <button type="button" className="flex items-center justify-center py-2.5 px-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md text-sm font-medium text-gray-700 dark:text-gray-200">
          <svg className="h-5 w-5 mr-2 text-[#4285F4]" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
          </svg>
          Google
        </button>

        <button type="button" className="flex items-center justify-center py-2.5 px-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md text-sm font-medium text-gray-700 dark:text-gray-200">
          <svg className="h-5 w-5 mr-2 text-[#3b5998]" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
          </svg>
          Facebook
        </button>
      </div>
    </form>
  );
}

// Componente de carga para Suspense
function Loading() {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
    </div>
  );
}

export default function LoginPage() {
  const { theme } = useTheme();
  
  return (
    <div className="h-[100vh] w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Botón de retorno en la esquina superior izquierda */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md border border-gray-100 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 group"
        >
          <svg className="h-4 w-4 text-primary-600 dark:text-primary-400 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Inicio</span>
        </Link>
      </div>
      
      {/* Botón de alternar tema en la esquina superior derecha */}
      <div className="absolute top-6 right-6 z-20">
        <div className="p-1 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md border border-gray-100 dark:border-gray-700">
          <ThemeToggle />
        </div>
      </div>
      
      {/* Efectos de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950 -z-10"></div>
      <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-[0.03] -z-10"></div>
      
      {/* Círculos decorativos */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-300/30 dark:bg-emerald-700/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-300/30 dark:bg-teal-800/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-blob animation-delay-4000"></div>
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-emerald-200/40 dark:bg-emerald-900/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-blob animation-delay-2000"></div>
      
      {/* Contenedor principal con glassmorphism */}
      <div className="w-full max-w-lg overflow-hidden relative z-10">
        <div className="relative flex flex-col bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30">
          {/* Contenido del formulario */}
          <div className="px-8 pt-16 pb-8 relative z-10">
            {/* Logo - ahora dentro del contenedor */}
            <div className="flex justify-center mb-8">
              <Image
                src={theme === 'dark' ? '/logos/JuegaMasOscuro.png' : '/logos/JuegaMas.png'}
                alt="JuegaMás Logo"
                width={120}
                height={40}
                priority
                className="h-auto w-auto drop-shadow-xl"
              />
            </div>
            
            <h2 className="text-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 pb-1 mb-1">
              ¡Bienvenido de nuevo!
            </h2>
            
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-8">
              Accede a tu cuenta para reservar canchas y más
            </p>
            
            {/* Formulario envuelto en Suspense */}
            <Suspense fallback={<Loading />}>
              <LoginForm />
            </Suspense>
            
            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              ¿No tienes una cuenta?{' '}
              <Link href="/auth/register" className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-200">
                Regístrate ahora
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 