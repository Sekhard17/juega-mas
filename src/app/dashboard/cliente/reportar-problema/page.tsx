'use client';

import { useState, useEffect } from 'react';
import { DashboardContainer } from '@/components/dashboard';
import { RoleGuard } from '@/components/dashboard';
import { incidenciasModel } from '@/models/incidenciasModel';
import { 
  Incidencia, 
  TipoIncidencia,
  EstadoIncidencia,
  getColorEstadoIncidencia 
} from '@/types/incidencia';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { reservasModel } from '@/models/reservasModel';
import { Reserva } from '@/types/reserva';
import { useAuth } from '@/providers/AuthProvider';
import { 
  ExclamationTriangleIcon, 
  PlusCircleIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  QuestionMarkCircleIcon,
  PaperClipIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// Componente para los pasos del formulario
const FormStep = ({ active, children }: { active: boolean; children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: active ? 1 : 0, y: active ? 0 : 20 }}
      transition={{ duration: 0.3 }}
      className={`${active ? 'block' : 'hidden'}`}
    >
      {children}
    </motion.div>
  );
};

// Componente para el tooltip
const Tooltip = ({ text }: { text: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div className="relative inline-block ml-1">
      <QuestionMarkCircleIcon 
        className="h-4 w-4 text-gray-400 cursor-help" 
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      />
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded py-1.5 px-2 shadow-lg z-10">
          <div className="relative">
            {text}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente para el formulario de nueva incidencia
const FormularioNuevaIncidencia = ({
  reservasUsuario,
  onCancel,
  onSuccess,
  userId
}: {
  reservasUsuario: Reserva[];
  onCancel: () => void;
  onSuccess: () => void;
  userId: string;
}) => {
  const [step, setStep] = useState(1);
  const [tipoIncidencia, setTipoIncidencia] = useState<TipoIncidencia>('problema_reserva');
  const [asunto, setAsunto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [reservaId, setReservaId] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState({
    asunto: false,
    descripcion: false
  });

  // Opciones para el tipo de incidencia con iconos
  const opcionesTipo = [
    { valor: 'problema_reserva', etiqueta: 'Problema con una reserva', icon: '🗓️', descripcion: 'Para problemas al realizar, modificar o cancelar una reserva' },
    { valor: 'problema_espacio', etiqueta: 'Problema con un espacio deportivo', icon: '🏟️', descripcion: 'Para reportar problemas con instalaciones o equipamiento' },
    { valor: 'problema_pago', etiqueta: 'Problema con un pago', icon: '💳', descripcion: 'Para dificultades con pagos o reembolsos' },
    { valor: 'problema_acceso', etiqueta: 'Problema de acceso a la plataforma', icon: '🔐', descripcion: 'Para problemas de inicio de sesión o permisos' },
    { valor: 'sugerencia', etiqueta: 'Sugerencia de mejora', icon: '💡', descripcion: 'Para proponer mejoras en el servicio o plataforma' },
    { valor: 'otro', etiqueta: 'Otro tipo de problema', icon: '❓', descripcion: 'Para asuntos que no encajan en las categorías anteriores' }
  ];

  // Validar si se puede continuar al siguiente paso
  const canContinueToStep2 = true; // tipoIncidencia siempre tiene un valor por defecto
  const canContinueToStep3 = asunto.trim().length >= 5;
  
  // Validación para la descripción
  const isDescripcionValid = descripcion.trim().length >= 20;
  const getDescripcionError = () => {
    if (!touched.descripcion) return null;
    if (descripcion.trim().length === 0) return 'La descripción es obligatoria';
    if (descripcion.trim().length < 20) return 'La descripción debe tener al menos 20 caracteres';
    return null;
  };
  
  // Validación para el asunto
  const isAsuntoValid = asunto.trim().length >= 5;
  const getAsuntoError = () => {
    if (!touched.asunto) return null;
    if (asunto.trim().length === 0) return 'El asunto es obligatorio';
    if (asunto.trim().length < 5) return 'El asunto debe tener al menos 5 caracteres';
    return null;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones finales
    if (!isAsuntoValid) {
      setError('Por favor, introduce un asunto válido para la incidencia');
      setStep(2);
      return;
    }
    
    if (!isDescripcionValid) {
      setError('Por favor, proporciona una descripción más detallada (mínimo 20 caracteres)');
      return;
    }
    
    setEnviando(true);
    setError(null);
    
    try {
      const resultado = await incidenciasModel.crearIncidencia(
        tipoIncidencia,
        asunto,
        descripcion,
        reservaId || undefined,
        undefined, // archivosAdjuntos
        userId
      );
      
      if (resultado.success) {
        onSuccess();
      } else {
        setError(resultado.message);
      }
    } catch (err) {
      console.error('Error al enviar incidencia:', err);
      setError('Ocurrió un error al enviar la incidencia. Por favor, inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  // Manejar el siguiente paso
  const nextStep = () => {
    if (step === 1 && canContinueToStep2) setStep(2);
    else if (step === 2 && canContinueToStep3) setStep(3);
  };

  // Manejar el paso anterior
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="space-y-6">
      {/* Progreso */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex flex-1 items-center">
              <div 
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step === stepNumber
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : step > stepNumber
                    ? 'border-emerald-500 bg-emerald-100 text-emerald-500 dark:bg-emerald-900/30'
                    : 'border-gray-300 bg-white text-gray-500 dark:border-gray-600 dark:bg-gray-800'
                } mx-auto`}
              >
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div 
                  className={`flex-1 h-1 mx-2 ${
                    step > stepNumber 
                      ? 'bg-emerald-500' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 px-1">
          <div className={`${step >= 1 ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>Tipo de problema</div>
          <div className={`${step >= 2 ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>Información básica</div>
          <div className={`${step >= 3 ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>Detalles</div>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Paso 1: Selección de tipo de incidencia */}
        <FormStep active={step === 1}>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">¿Qué tipo de problema necesitas reportar?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Selecciona la categoría que mejor describa tu problema para que podamos ayudarte más rápido.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {opcionesTipo.map((opcion) => (
                <div 
                  key={opcion.valor}
                  onClick={() => setTipoIncidencia(opcion.valor as TipoIncidencia)}
                  className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                    tipoIncidencia === opcion.valor 
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 dark:border-emerald-500'
                      : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="mr-3 text-2xl mt-1">{opcion.icon}</div>
                    <div>
                      <h4 className={`text-sm font-medium ${
                        tipoIncidencia === opcion.valor 
                          ? 'text-emerald-800 dark:text-emerald-300'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {opcion.etiqueta}
                      </h4>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{opcion.descripcion}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FormStep>
        
        {/* Paso 2: Información básica */}
        <FormStep active={step === 2}>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Información básica</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Proporciona un título claro y conciso que describa tu problema.</p>
            
            {/* Reserva relacionada (si aplica) */}
            {tipoIncidencia === 'problema_reserva' && (
              <div className="mt-4">
                <div className="flex items-center">
                  <label htmlFor="reservaId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Reserva relacionada
                  </label>
                  <Tooltip text="Selecciona la reserva específica que tiene el problema. Esto nos ayudará a resolver tu incidencia más rápido." />
                </div>
                <select
                  id="reservaId"
                  value={reservaId}
                  onChange={(e) => setReservaId(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-white"
                >
                  <option value="">-- Selecciona una reserva --</option>
                  {reservasUsuario.length === 0 && (
                    <option value="" disabled>No tienes reservas recientes</option>
                  )}
                  {reservasUsuario.map((reserva) => (
                    <option key={reserva.id} value={reserva.id}>
                      {reserva.codigo_reserva} - {reserva.espacio_nombre} ({new Date(reserva.fecha).toLocaleDateString()})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {tipoIncidencia === 'problema_reserva' && reservasUsuario.length === 0 
                    ? "No tienes reservas recientes. Si tu problema es con una reserva antigua, descríbelo en detalle."
                    : "Seleccionar una reserva nos ayudará a identificar y resolver tu problema más rápido."}
                </p>
              </div>
            )}
            
            {/* Asunto */}
            <div className="mt-4">
              <div className="flex items-center">
                <label htmlFor="asunto" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Asunto
                </label>
                <Tooltip text="Un buen asunto es breve y descriptivo. Por ejemplo: 'No puedo cancelar mi reserva #12345'" />
                <span className="ml-1 text-sm text-red-500">*</span>
              </div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  id="asunto"
                  value={asunto}
                  onChange={(e) => setAsunto(e.target.value)}
                  onBlur={() => setTouched({ ...touched, asunto: true })}
                  className={`block w-full border ${
                    touched.asunto && !isAsuntoValid
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-500 dark:focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-700 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:ring-emerald-500 dark:focus:border-emerald-500'
                  } rounded-md shadow-sm sm:text-sm dark:bg-gray-800 dark:text-white`}
                  placeholder="Ej: Canchas en mal estado en complejo deportivo Centro"
                  required
                />
                {touched.asunto && !isAsuntoValid && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                  </div>
                )}
              </div>
              {getAsuntoError() && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{getAsuntoError()}</p>
              )}
              <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Mínimo 5 caracteres.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {asunto.length}/100 caracteres
                </p>
              </div>
            </div>
          </div>
        </FormStep>
        
        {/* Paso 3: Detalles del problema */}
        <FormStep active={step === 3}>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Detalles del problema</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Proporciona todos los detalles posibles para que podamos ayudarte mejor.</p>
            
            {/* Descripción */}
            <div>
              <div className="flex items-center">
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Descripción detallada
                </label>
                <Tooltip text="Describe: qué pasó, cuándo ocurrió, qué acciones realizaste y qué errores viste. Cuantos más detalles, más rápido podremos ayudarte." />
                <span className="ml-1 text-sm text-red-500">*</span>
              </div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <textarea
                  id="descripcion"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  onBlur={() => setTouched({ ...touched, descripcion: true })}
                  rows={6}
                  className={`block w-full border ${
                    touched.descripcion && !isDescripcionValid 
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-500 dark:focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-700 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:ring-emerald-500 dark:focus:border-emerald-500'
                  } rounded-md shadow-sm sm:text-sm dark:bg-gray-800 dark:text-white`}
                  placeholder="Incluye toda la información relevante: fecha y hora del problema, pasos que seguiste, errores que viste, etc."
                  required
                />
              </div>
              {getDescripcionError() && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{getDescripcionError()}</p>
              )}
              <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Mínimo 20 caracteres
                </p>
                <p className={`text-xs ${
                  descripcion.length < 20 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {descripcion.length}/2000 caracteres
                </p>
              </div>
            </div>
            
            {/* Consejos para una buena descripción */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg mt-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Consejos para una buena descripción:</h4>
                  <ul className="mt-1 text-xs text-blue-700 dark:text-blue-300 list-disc list-inside space-y-1">
                    <li>Incluye la fecha y hora exacta del problema</li>
                    <li>Describe los pasos que seguiste antes de que ocurriera</li>
                    <li>Menciona cualquier mensaje de error que hayas visto</li>
                    <li>Si es un problema con un espacio, incluye el nombre y ubicación</li>
                    <li>Indica si has intentado alguna solución</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </FormStep>
        
        {/* Botones de navegación */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-gray-900"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Anterior
            </button>
          ) : (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-gray-900"
            >
              Cancelar
            </button>
          )}
          
          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={(step === 1 && !canContinueToStep2) || (step === 2 && !canContinueToStep3)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
              <ArrowLeftIcon className="ml-2 h-4 w-4 transform rotate-180" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={enviando || !isDescripcionValid}
              className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {enviando ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                <>Enviar incidencia</>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// Componente para mostrar el listado de incidencias
const ListadoIncidencias = ({ 
  incidencias 
}: { 
  incidencias: Incidencia[] 
}) => {
  if (incidencias.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No hay incidencias registradas</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Aún no has reportado ningún problema. Si necesitas ayuda, utiliza el botón "Reportar problema".
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {incidencias.map((incidencia) => {
        const colores = getColorEstadoIncidencia(incidencia.estado);
        const fecha = new Date(incidencia.fecha_creacion).toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
        
        // Iconos para los tipos de incidencia
        const getTipoIcon = () => {
          switch (incidencia.tipo) {
            case 'problema_reserva':
              return '🗓️';
            case 'problema_espacio':
              return '🏟️';
            case 'problema_pago':
              return '💳';
            case 'problema_acceso':
              return '🔐';
            case 'sugerencia':
              return '💡';
            default:
              return '❓';
          }
        };
        
        // Texto para el tipo de incidencia
        const getTipoText = () => {
          switch (incidencia.tipo) {
            case 'problema_reserva':
              return 'Problema con reserva';
            case 'problema_espacio':
              return 'Problema con espacio';
            case 'problema_pago':
              return 'Problema con pago';
            case 'problema_acceso':
              return 'Problema de acceso';
            case 'sugerencia':
              return 'Sugerencia';
            default:
              return 'Otro problema';
          }
        };
        
        return (
          <motion.div
            key={incidencia.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.01 }}
          >
            <Link
              href={`/dashboard/cliente/reportar-problema/${incidencia.id}`}
              className="block group"
            >
              <div 
                className="bg-white dark:bg-gray-800 rounded-lg border-l-4 shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors"
                style={{ borderLeftColor: incidencia.estado === 'pendiente' ? '#fbbf24' : 
                                         incidencia.estado === 'en_revision' ? '#60a5fa' : 
                                         incidencia.estado === 'resuelta' ? '#34d399' : '#9ca3af' }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">{getTipoIcon()}</span>
                    <h3 className="text-base font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {incidencia.asunto}
                    </h3>
                  </div>
                  <div className={`
                    inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                    ${colores.bg} ${colores.text} ${colores.dark} ml-2
                  `}>
                    {incidencia.estado === 'pendiente' 
                      ? 'Pendiente' 
                      : incidencia.estado === 'en_revision'
                      ? 'En revisión'
                      : incidencia.estado === 'resuelta'
                      ? 'Resuelta'
                      : 'Cerrada'
                    }
                  </div>
                </div>
                
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <span className="font-medium">{fecha}</span>
                  <span className="mx-2">•</span>
                  <span>{getTipoText()}</span>
                  
                  {incidencia.reserva_id && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="flex items-center">
                        <PaperClipIcon className="h-3 w-3 mr-1" />
                        Reserva adjunta
                      </span>
                    </>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                  {incidencia.descripcion}
                </p>
                
                {incidencia.respuesta && (
                  <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      <span className="font-medium block mb-1">Respuesta:</span>
                      <span className="line-clamp-2">{incidencia.respuesta}</span>
                    </p>
                  </div>
                )}
                
                <div className="mt-3 text-xs text-right">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    Ver detalles →
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};

// Componente principal de la página
export default function ReportarProblemaPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [reservasUsuario, setReservasUsuario] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(true);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    pendientes: 0,
    en_revision: 0,
    resueltas: 0,
    cerradas: 0
  });
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  // Actualizar el título de forma dinámica en el cliente
  useEffect(() => {
    document.title = 'Reportar Problema | JuegaMás';
  }, []);

  // Cargar incidencias y reservas del usuario
  useEffect(() => {
    const cargarDatos = async () => {
      if (!user) return;
      
      setCargando(true);
      try {
        // Cargar incidencias
        const resultadoIncidencias = await incidenciasModel.listarIncidenciasUsuario({}, user.id.toString());
        setIncidencias(resultadoIncidencias.incidencias);
        
        // Cargar estadísticas
        const stats = await incidenciasModel.obtenerEstadisticasIncidencias(user.id.toString());
        setEstadisticas(stats);
        
        // Cargar reservas para el selector del formulario
        const resultadoReservas = await reservasModel.listarReservasUsuario({}, user.id.toString());
        setReservasUsuario(resultadoReservas.reservas);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setCargando(false);
      }
    };
    
    cargarDatos();
  }, [user]);

  // Manejar creación exitosa de una incidencia
  const handleIncidenciaCreada = () => {
    if (!user) return;
    
    setMostrarFormulario(false);
    setMensajeExito('¡Tu incidencia ha sido reportada con éxito! Te responderemos lo antes posible. Puedes consultar el estado de tu incidencia en cualquier momento.');
    
    // Recargar la lista de incidencias
    incidenciasModel.listarIncidenciasUsuario({}, user.id.toString()).then(resultado => {
      setIncidencias(resultado.incidencias);
    });
    
    // Recargar estadísticas
    incidenciasModel.obtenerEstadisticasIncidencias(user.id.toString()).then(stats => {
      setEstadisticas(stats);
    });
    
    // Ocultar el mensaje después de 8 segundos
    setTimeout(() => {
      setMensajeExito(null);
    }, 8000);
  };

  return (
    <RoleGuard allowedRoles={['cliente', 'usuario']}>
      <div className="space-y-6">
        {/* Mensaje de éxito con animación */}
        {mensajeExito && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start"
          >
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-green-800 dark:text-green-200">{mensajeExito}</p>
            </div>
            <button 
              className="ml-auto flex-shrink-0 text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300"
              onClick={() => setMensajeExito(null)}
            >
              <XCircleIcon className="h-5 w-5" />
            </button>
          </motion.div>
        )}
        
        {/* Contenedor principal */}
        <DashboardContainer 
          title={mostrarFormulario ? "Reportar un problema" : "Centro de ayuda"} 
          description={mostrarFormulario ? "Completa el formulario para reportar un problema" : "Reporta problemas y consulta el estado de tus incidencias"}
          actions={
            mostrarFormulario ? (
              <button
                onClick={() => setMostrarFormulario(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1.5" />
                Volver
              </button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMostrarFormulario(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <PlusCircleIcon className="h-4 w-4 mr-1.5" />
                Reportar problema
              </motion.button>
            )
          }
        >
          {mostrarFormulario ? (
            <FormularioNuevaIncidencia 
              reservasUsuario={reservasUsuario}
              onCancel={() => setMostrarFormulario(false)}
              onSuccess={handleIncidenciaCreada}
              userId={user?.id.toString() || ''}
            />
          ) : (
            <div className="space-y-6">
              {/* Estadísticas con animación */}
              {!cargando && estadisticas.total > 0 && (
                <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">Resumen de tus incidencias</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0 }}
                        className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg flex flex-col items-center justify-center"
                      >
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</span>
                        <span className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{estadisticas.total}</span>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg flex flex-col items-center justify-center"
                      >
                        <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Pendientes</span>
                        <span className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{estadisticas.pendientes}</span>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg flex flex-col items-center justify-center"
                      >
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">En revisión</span>
                        <span className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{estadisticas.en_revision}</span>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg flex flex-col items-center justify-center"
                      >
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">Resueltas</span>
                        <span className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{estadisticas.resueltas}</span>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                        className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg flex flex-col items-center justify-center"
                      >
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Cerradas</span>
                        <span className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{estadisticas.cerradas}</span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Guía rápida */}
              {!cargando && incidencias.length === 0 && (
                <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-6">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Guía rápida para reportar problemas</h3>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      ¿Necesitas ayuda con JuegaMás? Reportar un problema es muy sencillo:
                    </p>
                    
                    <ul className="space-y-3 text-sm">
                      <li className="flex">
                        <span className="flex-shrink-0 w-5 h-5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-xs font-medium mr-2">1</span>
                        <span className="text-gray-700 dark:text-gray-300">Haz clic en el botón "Reportar problema" en la parte superior</span>
                      </li>
                      <li className="flex">
                        <span className="flex-shrink-0 w-5 h-5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-xs font-medium mr-2">2</span>
                        <span className="text-gray-700 dark:text-gray-300">Selecciona el tipo de problema que estás experimentando</span>
                      </li>
                      <li className="flex">
                        <span className="flex-shrink-0 w-5 h-5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-xs font-medium mr-2">3</span>
                        <span className="text-gray-700 dark:text-gray-300">Completa la información solicitada, siendo lo más detallado posible</span>
                      </li>
                      <li className="flex">
                        <span className="flex-shrink-0 w-5 h-5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-xs font-medium mr-2">4</span>
                        <span className="text-gray-700 dark:text-gray-300">Envía tu reporte y nuestro equipo lo revisará lo antes posible</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              
              {/* Título de sección */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Tus incidencias</h2>
                {!cargando && incidencias.length > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    {incidencias.length} {incidencias.length === 1 ? 'incidencia' : 'incidencias'}
                  </span>
                )}
              </div>
              
              {/* Estado de cargando */}
              {cargando ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                </div>
              ) : (
                <ListadoIncidencias incidencias={incidencias} />
              )}
            </div>
          )}
        </DashboardContainer>
      </div>
    </RoleGuard>
  );
} 