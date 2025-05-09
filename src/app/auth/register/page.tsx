'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '../../../components/shared/ThemeProvider';
import ThemeToggle from '../../../components/ui/ThemeToggle';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { register } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estados para los campos del formulario
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    telefono: '',
  });
  
  // Estado para la vista previa de la imagen
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  
  // Estados para UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: datos básicos, 2: datos complementarios
  
  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Manejar selección de avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Verificar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen no debe superar los 5MB');
        return;
      }
      
      // Verificar tipo
      if (!file.type.match('image.*')) {
        setError('El archivo debe ser una imagen');
        return;
      }
      
      // Crear URL para vista previa
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarPreview(event.target.result as string);
          setAvatarFile(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Manejar click en área de avatar
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  
  // Validar paso 1
  const validateStep1 = () => {
    // Validar email
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Por favor, introduce un email válido');
      return false;
    }
    
    // Validar contraseña
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }
    
    // Validar confirmación de contraseña
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    
    return true;
  };
  
  // Avanzar al siguiente paso
  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateStep1()) {
      setError('');
      setStep(2);
    }
  };
  
  // Volver al paso anterior
  const handlePrevStep = () => {
    setStep(1);
    setError('');
  };
  
  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar nombre
    if (!formData.nombre) {
      setError('Por favor, introduce tu nombre');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // Usar el AuthProvider para registrar al usuario
      const success = await register({
        email: formData.email,
        password: formData.password,
        nombre: formData.nombre,
        telefono: formData.telefono || undefined,
      });
      
      if (success) {
        // La imagen se manejaría en una actualización de perfil separada
        // ya que requeriría primero subir el archivo a storage
        
        toast.success('Registro exitoso');
        router.push('/auth/login?registered=true');
      } else {
        setError('Error al registrar usuario. El correo electrónico podría ya estar en uso.');
      }
    } catch (err) {
      setError('Error al registrar usuario. Por favor, intenta nuevamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="h-[100vh] w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Botón de retorno */}
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
      
      {/* Botón de alternar tema */}
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
          {/* Eliminar el elemento decorativo superior */}
          
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
              {step === 1 ? 'Crea tu cuenta' : 'Completa tu perfil'}
            </h2>
            
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
              {step === 1 ? (
                'Regístrate para empezar a reservar canchas'
              ) : (
                'Añade tus datos para personalizar tu experiencia'
              )}
            </p>
            
            {/* Indicador de pasos */}
            <div className="flex justify-center items-center space-x-12 mb-8">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 1 ? 'bg-emerald-500 text-white' : 'bg-emerald-500 text-white'}`}>
                  1
                </div>
                <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">Cuenta</span>
              </div>
              <div className="w-16 h-0.5 bg-gray-200 dark:bg-gray-700 relative">
                <div className={`absolute top-0 left-0 h-full bg-emerald-500 transition-all duration-300 ${step > 1 ? 'w-full' : 'w-0'}`}></div>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                  2
                </div>
                <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">Perfil</span>
              </div>
            </div>
            
            {/* Formulario Paso 1: Datos básicos */}
            {step === 1 && (
              <form className="space-y-5" onSubmit={handleNextStep}>
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-xl text-sm flex items-start">
                    <svg className="h-5 w-5 flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{error}</span>
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
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700/80 dark:text-white text-sm transition-all duration-200"
                      placeholder="tu@email.com"
                    />
                  </div>
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
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700/80 dark:text-white text-sm transition-all duration-200"
                      placeholder="Mínimo 8 caracteres"
                    />
                  </div>
                </div>
                
                <div className="group">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors">
                    Confirmar contraseña
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700/80 dark:text-white text-sm transition-all duration-200"
                      placeholder="Repite tu contraseña"
                    />
                  </div>
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Continuar
                  </button>
                </div>
              </form>
            )}
            
            {/* Formulario Paso 2: Datos de perfil */}
            {step === 2 && (
              <form className="space-y-5" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-xl text-sm flex items-start">
                    <svg className="h-5 w-5 flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}
                
                {/* Avatar */}
                <div className="mb-5 flex flex-col items-center">
                  <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Foto de perfil (opcional)
                  </label>
                  <div 
                    onClick={handleAvatarClick}
                    className="relative w-28 h-28 rounded-full border-2 border-gray-300 dark:border-gray-600 border-dashed flex items-center justify-center cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors overflow-hidden group shadow-lg"
                  >
                    {avatarPreview ? (
                      <Image 
                        src={avatarPreview} 
                        alt="Vista previa"
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-full"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 opacity-50 group-hover:opacity-70 transition-opacity"></div>
                        <svg className="h-10 w-10 text-emerald-500 dark:text-emerald-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <div className="absolute -bottom-10 group-hover:bottom-0 left-0 right-0 bg-emerald-500 text-white text-xs py-1.5 text-center transition-all duration-300">
                          Subir foto
                        </div>
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    id="avatar" 
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarPreview(null);
                        setAvatarFile(null);
                      }}
                      className="mt-2 text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center"
                    >
                      <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Eliminar foto
                    </button>
                  )}
                </div>
                
                <div className="group">
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors">
                    Nombre completo
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      autoComplete="name"
                      required
                      value={formData.nombre}
                      onChange={handleChange}
                      className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700/80 dark:text-white text-sm transition-all duration-200"
                      placeholder="Tu nombre y apellido"
                    />
                  </div>
                </div>
                
                <div className="group">
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors">
                    Teléfono (opcional)
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      autoComplete="tel"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700/80 dark:text-white text-sm transition-all duration-200"
                      placeholder="+34 600 123 456"
                    />
                  </div>
                </div>
                
                <div className="flex justify-between gap-4 pt-2">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="w-1/3 flex justify-center items-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Atrás
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-2/3 flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Registrando...
                      </>
                    ) : (
                      'Completar registro'
                    )}
                  </button>
                </div>
              </form>
            )}
            
            {/* Términos y condiciones */}
            <p className="mt-6 text-xs text-center text-gray-600 dark:text-gray-400">
              Al registrarte, aceptas nuestros{' '}
              <Link href="/terminos" className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300">
                Términos y condiciones
              </Link>{' '}
              y nuestra{' '}
              <Link href="/privacidad" className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300">
                Política de privacidad
              </Link>
            </p>
            
            {/* Enlace a login - movido del encabezado al pie de página */}
            {step === 1 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ¿Ya tienes cuenta?{' '}
                  <Link href="/auth/login" className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-200">
                    Inicia sesión
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 