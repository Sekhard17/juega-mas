'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Image from 'next/image';

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
        if (value.length < 3) error = 'El nombre debe tener al menos 3 caracteres';
        break;
      case 'email':
        if (!validarEmail(value)) error = 'Por favor, ingresa un correo electrónico válido';
        break;
      case 'telefono':
        if (value && !validarTelefono(value)) error = 'Por favor, ingresa un número de teléfono válido (+569XXXXXXXX)';
        break;
      case 'asunto':
        if (value.length < MIN_ASUNTO_LENGTH) error = `El asunto debe tener al menos ${MIN_ASUNTO_LENGTH} caracteres`;
        if (value.length > MAX_ASUNTO_LENGTH) error = `El asunto no puede tener más de ${MAX_ASUNTO_LENGTH} caracteres`;
        break;
      case 'mensaje':
        if (value.length < MIN_MENSAJE_LENGTH) error = `El mensaje debe tener al menos ${MIN_MENSAJE_LENGTH} caracteres`;
        if (value.length > MAX_MENSAJE_LENGTH) error = `El mensaje no puede tener más de ${MAX_MENSAJE_LENGTH} caracteres`;
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
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

    // Validar todos los campos
    Object.entries(formData).forEach(([key, value]) => {
      validateField(key, value);
    });

    // Verificar si hay errores
    const hasErrors = Object.values(errors).some(error => error !== '');
    if (hasErrors) {
      toast.error('Por favor, corrige los errores en el formulario');
      return;
    }

    // Aquí iría la lógica de envío del formulario
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
  };

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado principal */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent mb-2">
            ¡Conversemos sobre tu próximo proyecto!
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            En JuegaMás creemos que cada idea merece la oportunidad de brillar. Estamos aquí para escucharte y crear juntos algo extraordinario.
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
              Contáctanos
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
                    required
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
                    type="email"
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
                    required
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
                    required
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
                  required
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
                  className="w-full flex justify-center items-center px-6 py-2.5 border border-transparent rounded-lg text-base font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Enviar mensaje
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
                ¿Por qué trabajar juntos?
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                      <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Visión Innovadora
                    </h4>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                      Como nuevo emprendimiento, traemos ideas frescas y una perspectiva única al mercado de entretenimiento.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                      <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Compromiso Personal
                    </h4>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                      Como fundador, me involucro directamente en cada proyecto para asegurar su éxito y calidad.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                      <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Enfoque en el Crecimiento
                    </h4>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                      Buscamos crecer junto a nuestros clientes y partners, construyendo relaciones duraderas.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección CEO */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl p-8 text-white">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-shrink-0">
                  <Image
                    src="/images/ceo-profile.jpg"
                    alt="Joaquín Andrade"
                    width={64}
                    height={64}
                    className="rounded-full border-2 border-white"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Joaquín Andrade</h3>
                  <p className="text-emerald-100">Fundador & CEO</p>
                  <p className="text-sm text-emerald-100">JuegaMás | Spectrum Code Software</p>
                </div>
              </div>
              <blockquote className="text-emerald-50 italic">
                "Como emprendedor apasionado por la tecnología y la innovación, estoy comprometido a revolucionar la forma en que las personas disfrutan del entretenimiento. ¿Te gustaría ser parte de este emocionante proyecto?"
              </blockquote>
            </div>

            {/* Información de reuniones */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                ¡Conversemos!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Ya sea que tengas una idea clara o solo quieras explorar posibilidades, estamos aquí para escucharte.
              </p>
              <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Reuniones presenciales o virtuales</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Horarios que se adaptan a ti</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Primera reunión sin compromiso</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 