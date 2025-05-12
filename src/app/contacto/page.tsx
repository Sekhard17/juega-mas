'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Image from 'next/image';
import { API_ROUTES } from '@/lib/apiConfig';

// Constantes para validación
const MAX_MENSAJE_LENGTH = 500;
const MIN_MENSAJE_LENGTH = 20;
const MIN_ASUNTO_LENGTH = 5;
const MAX_ASUNTO_LENGTH = 100;

// Dominios de correo permitidos
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

export default function ContactoPage() {
  // Estados para los campos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
    telefono: ''
  });

  // Estados para errores
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  // Estado para indicar cuando se está enviando el formulario
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validar email
  const validarEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;
    const dominio = email.split('@')[1].toLowerCase();
    return DOMINIOS_PERMITIDOS.includes(dominio);
  };

  // Validar teléfono
  const validarTelefono = (telefono: string): boolean => {
    const telefonoRegex = /^(\+?56)?[ -]*(9)[ -]*([0-9][ -]*){8}$/;
    return telefonoRegex.test(telefono.replace(/\s/g, ''));
  };

  // Manejar cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // Validar campo específico
  const validateField = (name: string, value: string) => {
    let error = '';

    switch (name) {
      case 'nombre':
        if (!value.trim()) {
          error = 'El nombre es obligatorio';
        } else if (value.length < 3) {
          error = 'El nombre debe tener al menos 3 caracteres';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'El correo electrónico es obligatorio';
        } else if (!validarEmail(value)) {
          error = 'Por favor, ingresa un correo electrónico válido';
        }
        break;
      case 'telefono':
        if (value && !validarTelefono(value)) {
          error = 'Por favor, ingresa un número de teléfono válido (+569XXXXXXXX)';
        }
        break;
      case 'asunto':
        if (!value.trim()) {
          error = 'El asunto es obligatorio';
        } else if (value.length < MIN_ASUNTO_LENGTH) {
          error = `El asunto debe tener al menos ${MIN_ASUNTO_LENGTH} caracteres`;
        } else if (value.length > MAX_ASUNTO_LENGTH) {
          error = `El asunto no puede tener más de ${MAX_ASUNTO_LENGTH} caracteres`;
        }
        break;
      case 'mensaje':
        if (!value.trim()) {
          error = 'El mensaje es obligatorio';
        } else if (value.length < MIN_MENSAJE_LENGTH) {
          error = `El mensaje debe tener al menos ${MIN_MENSAJE_LENGTH} caracteres`;
        } else if (value.length > MAX_MENSAJE_LENGTH) {
          error = `El mensaje no puede tener más de ${MAX_MENSAJE_LENGTH} caracteres`;
        }
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return error === ''; // Retorna true si no hay error
  };

  // Manejar pérdida de foco
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name as keyof typeof formData]);
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Marcar todos los campos como tocados
    const allTouched = Object.keys(formData).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {} as { [K in keyof typeof touched]: boolean });
    setTouched(allTouched);

    // Validar todos los campos y verificar si hay errores
    let isValid = true;
    Object.entries(formData).forEach(([key, value]) => {
      // Si algún campo no es válido, marcamos todo el formulario como inválido
      if (!validateField(key, value)) {
        isValid = false;
      }
    });

    // Si hay errores, mostrar mensaje y detener el envío
    if (!isValid) {
      toast.error('Por favor, corrige los errores en el formulario');
      return;
    }

    try {
      // Activar estado de carga
      setIsSubmitting(true);
      
      // Enviar datos al endpoint
      const response = await fetch(API_ROUTES.CONTACTO.ENVIAR, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el mensaje');
      }

      // Mostrar mensaje de éxito
      toast.success('Mensaje enviado correctamente');
      
      // Resetear formulario
      setFormData({
        nombre: '',
        email: '',
        asunto: '',
        mensaje: '',
        telefono: ''
      });
      setTouched({});
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      toast.error('Ocurrió un error al enviar el mensaje. Por favor, intenta nuevamente.');
    } finally {
      // Desactivar estado de carga
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado principal */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent mb-2">
            ¿Tienes un recinto deportivo? Maximiza tus ingresos
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Únete a JuegaMás y lleva tu negocio al siguiente nivel. Aumenta la visibilidad de tus instalaciones, optimiza tu agenda y recibe más reservas sin esfuerzo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulario de contacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 h-fit"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Registra tu espacio deportivo
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Primera fila: Nombre y Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`mt-1 block w-full rounded-lg border ${
                      touched.nombre && errors.nombre
                        ? 'border-red-500 dark:border-red-400'
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500`}
                  />
                  {touched.nombre && errors.nombre && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.nombre}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Correo electrónico *
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`mt-1 block w-full rounded-lg border ${
                      touched.email && errors.email
                        ? 'border-red-500 dark:border-red-400'
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500`}
                  />
                  {touched.email && errors.email && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Segunda fila: Teléfono y Asunto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Teléfono (opcional)
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="+569XXXXXXXX"
                    className={`mt-1 block w-full rounded-lg border ${
                      touched.telefono && errors.telefono
                        ? 'border-red-500 dark:border-red-400'
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500`}
                  />
                  {touched.telefono && errors.telefono && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.telefono}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="asunto" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Asunto *
                  </label>
                  <input
                    type="text"
                    id="asunto"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`mt-1 block w-full rounded-lg border ${
                      touched.asunto && errors.asunto
                        ? 'border-red-500 dark:border-red-400'
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500`}
                  />
                  {touched.asunto && errors.asunto && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.asunto}</p>
                  )}
                </div>
              </div>

              {/* Mensaje */}
              <div>
                <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Mensaje *
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={4}
                  maxLength={MAX_MENSAJE_LENGTH}
                  className={`mt-1 block w-full rounded-lg border ${
                    touched.mensaje && errors.mensaje
                      ? 'border-red-500 dark:border-red-400'
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500 resize-none h-24`}
                />
                {touched.mensaje && errors.mensaje && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.mensaje}</p>
                )}
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {formData.mensaje.length}/{MAX_MENSAJE_LENGTH} caracteres
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center items-center px-6 py-2.5 border border-transparent rounded-lg text-base font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    'Enviar mensaje'
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Sección informativa */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4 h-fit"
          >
            {/* Información de contacto */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                ¿Por qué unirte a JuegaMás?
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                      <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Aumenta tus ingresos
                    </h4>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                      Nuestros socios experimentan un aumento promedio del 30% en sus reservas durante los primeros tres meses.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                      <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Gestión sin complicaciones
                    </h4>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                      Panel de administración intuitivo para gestionar tus reservas, horarios y pagos en un solo lugar.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                      <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Acceso a nuevos clientes
                    </h4>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                      Conecta con nuestra comunidad de +15,000 deportistas activos buscando espacios como el tuyo.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección CEO */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl p-8 text-white">
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex-shrink-0">
                  <Image
                    src="/avatars/CEO.jpeg"
                    alt="Sekhard"
                    width={96}
                    height={96}
                    className="rounded-full border-2 border-white object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Joaquín Andrade</h3>
                  <p className="text-emerald-100">Fundador & CEO</p>
                  <p className="text-emerald-200 text-sm">Analista Programador</p>
                  <p className="text-emerald-200 text-sm">JuegaMás | Spectrum Code Software</p>
                </div>
              </div>
              <blockquote className="text-emerald-50 italic">
                "Como propietario de instalaciones deportivas, entiendo los desafíos de maximizar la ocupación y gestionar reservas eficientemente. JuegaMás nació para resolver estos problemas, conectando tus espacios con deportistas y ofreciéndote las herramientas digitales necesarias para crecer. ¿Listo para transformar tu negocio?"
              </blockquote>
            </div>

            {/* Información de reuniones */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Comienza a recibir reservas
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Unirse a JuegaMás es rápido y sin riesgos. Nuestro equipo te guiará en cada paso del proceso.
              </p>
              <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Sin comisiones por inicio</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Configuración en menos de 48 horas</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Asistencia personalizada continua</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 