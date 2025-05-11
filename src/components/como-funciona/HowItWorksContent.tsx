'use client';

import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { motion } from 'framer-motion';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const steps = [
  {
    title: "Explora",
    description: "Encuentra los mejores espacios deportivos cerca de ti con nuestra interfaz intuitiva y filtros avanzados.",
    icon: "/icons/explore-icon.svg",
    image: "/images/explora-deporte.webp",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20"
  },
  {
    title: "Selecciona",
    description: "Elige el horario perfecto para tu actividad deportiva y revisa la disponibilidad en tiempo real.",
    icon: "/icons/calendar-icon.svg",
    image: "/images/selecciona-horario.webp",
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20"
  },
  {
    title: "Reserva",
    description: "Confirma tu reserva de manera segura, paga online y recibe la confirmación instantánea en tu correo.",
    icon: "/icons/check-icon.svg",
    image: "/images/reserva-segura.webp",
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-50 dark:bg-teal-900/20"
  },
  {
    title: "¡Juega!",
    description: "Disfruta de tu actividad deportiva en las mejores instalaciones y comparte tu experiencia.",
    icon: "/icons/play-icon.svg",
    image: "/images/disfruta-juega.webp",
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20"
  },
];

// Placeholder para las imágenes hasta que estén disponibles
const ImageFallback = ({ color }: { color: string }) => (
  <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center`}>
    <span className="text-white text-xl font-medium">Imagen ilustrativa</span>
  </div>
);

export function HowItWorksContent() {
  const mainContainer = useRef<HTMLDivElement>(null);
  const horizontalWrapper = useRef<HTMLDivElement>(null);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const progressBar = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  const [activeStep, setActiveStep] = useState(0);

  // Configuración del scroll horizontal
  useGSAP(() => {
    if (!mainContainer.current || !horizontalWrapper.current) return;

    // Definir la sección horizontal
    const sections = gsap.utils.toArray<HTMLElement>('.panel');
    const totalWidth = sections.length * 100;
    
    // Configurar el contenedor horizontal
    gsap.set(horizontalWrapper.current, { 
      width: `${totalWidth}%`,
      display: 'flex',
    });
    
    // Configurar cada panel
    sections.forEach((section) => {
      gsap.set(section, { width: `${100 / sections.length}%` });
    });

    // Crear la animación de scroll horizontal
    const horizontalScroll = gsap.to(horizontalWrapper.current, {
      x: () => {
        // Calculamos cuánto hay que mover: -(ancho total - viewport)
        const width = horizontalWrapper.current!.scrollWidth;
        const viewportWidth = window.innerWidth;
        return -(width - viewportWidth);
      },
      ease: 'none',
      scrollTrigger: {
        trigger: mainContainer.current,
        start: 'top top',
        end: () => `+=${horizontalWrapper.current!.scrollWidth - window.innerWidth + 100}`,
        pin: true,
        anticipatePin: 1,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Actualizar barra de progreso
          if (progressBar.current) {
            gsap.to(progressBar.current, {
              width: `${self.progress * 100}%`,
              duration: 0.1
            });
          }
          
          // Actualizar paso activo
          const newActiveStep = Math.min(
            steps.length - 1,
            Math.floor(self.progress * steps.length)
          );
          if (newActiveStep !== activeStep) {
            setActiveStep(newActiveStep);
          }
        }
      }
    });

    // Animaciones para cada panel cuando entra en la vista
    sections.forEach((panel, i) => {
      // Título
      gsap.from(panel.querySelector('.step-title'), {
        y: 50,
        opacity: 0,
        duration: 0.6,
        scrollTrigger: {
          trigger: panel,
          start: 'left center',
          containerAnimation: horizontalScroll,
          toggleActions: 'play none none reverse'
        }
      });
      
      // Descripción
      gsap.from(panel.querySelector('.step-description'), {
        y: 30,
        opacity: 0,
        duration: 0.6,
        delay: 0.2,
        scrollTrigger: {
          trigger: panel,
          start: 'left center',
          containerAnimation: horizontalScroll,
          toggleActions: 'play none none reverse'
        }
      });
      
      // Imagen
      gsap.from(panel.querySelector('.step-image'), {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        scrollTrigger: {
          trigger: panel,
          start: 'left center',
          containerAnimation: horizontalScroll,
          toggleActions: 'play none none reverse'
        }
      });
    });

    // Animación del título e introducción
    gsap.from('.hero-title', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    });

    gsap.from('.hero-description', {
      y: 30,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      ease: 'power3.out',
    });

    // Botones de navegación entre pasos
    document.querySelectorAll('.step-nav-button').forEach((button, i) => {
      button.addEventListener('click', () => {
        // Calcular la posición exacta en el scroll para este paso
        const progress = i / (steps.length - 1);
        const scrollTriggerInstance = ScrollTrigger.getById('horizontal-scroll');
        
        if (scrollTriggerInstance) {
          // Convertir el progreso a posición de scroll
          const startPosition = scrollTriggerInstance.start;
          const endPosition = scrollTriggerInstance.end;
          const scrollPosition = startPosition + (endPosition - startPosition) * progress;
          
          // Animar hasta esa posición
          gsap.to(window, {
            scrollTo: scrollPosition,
            duration: 1,
            ease: 'power2.inOut'
          });
        }
      });
    });

    return () => {
      horizontalScroll.scrollTrigger?.kill();
    };
  }, { scope: mainContainer });

  // Comprobar si una imagen existe o no
  const checkImageExists = (url: string, index: number) => {
    if (!url) return;
    
    const img = new globalThis.Image();
    img.src = url;
    
    img.onload = () => {
      setImagesLoaded(prev => ({ ...prev, [index]: true }));
    };
    
    img.onerror = () => {
      setImagesLoaded(prev => ({ ...prev, [index]: false }));
    };
  };

  // Comprobar existencia de imágenes al cargar el componente
  useEffect(() => {
    steps.forEach((step, index) => {
      if (step.image) {
        checkImageExists(step.image, index);
      }
    });
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section - Modern & Animated */}
      <div className="relative text-center space-y-8 py-20 px-4 mb-12">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-50 to-transparent dark:from-emerald-950/20 dark:to-transparent rounded-3xl opacity-70 blur-3xl transform -translate-y-1/2 scale-y-150"></div>
        
        <motion.h1 
          className="hero-title text-5xl md:text-7xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Juega Más
          </span>
          {" "}
          <span className="text-gray-800 dark:text-white">
            en 4 pasos
          </span>
        </motion.h1>
        
        <p className="hero-description text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Reservar tu espacio deportivo nunca fue tan fácil. Nuestra plataforma está diseñada para
          que puedas encontrar y reservar el espacio perfecto en cuestión de minutos.
        </p>
        
        <div className="pt-2">
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 mx-auto rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        
        {/* Navegación por pasos */}
        <div className="flex justify-center items-center gap-4 pt-6">
          {steps.map((step, idx) => (
            <button
              key={`nav-${idx}`}
              className={`step-nav-button w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                ${activeStep === idx 
                ? `bg-gradient-to-r ${step.color} text-white shadow-lg scale-110` 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              aria-label={`Ir al paso ${idx + 1}: ${step.title}`}
            >
              <span className="text-lg font-bold">{idx + 1}</span>
            </button>
          ))}
        </div>
        
        {/* Barra de progreso global */}
        <div className="w-full max-w-md mx-auto h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-6">
          <div 
            ref={progressBar}
            className="h-full bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full"
            style={{ width: '0%' }}
          ></div>
        </div>
      </div>

      {/* Sección de scroll horizontal */}
      <div ref={mainContainer} className="horizontal-scroll-section relative h-screen">
        <div ref={horizontalWrapper} className="horizontal-wrapper">
          {steps.map((step, index) => (
            <div 
              key={step.title}
              ref={el => { panels.current[index] = el; }}
              className={`panel min-h-screen px-4 sm:px-10 py-12 ${step.bgColor} flex flex-col items-center justify-center`}
            >
              <div className="flex flex-col lg:flex-row items-center gap-8 max-w-6xl mx-auto">
                {/* Contenido del paso */}
                <div className="flex-1 space-y-6 text-center lg:text-left">
                  <div className="inline-flex items-center gap-4">
                    <div className={`flex items-center justify-center w-16 h-16 rounded-full shadow-lg bg-gradient-to-r ${step.color} text-white p-4`}>
                      <Image 
                        src={step.icon}
                        alt={step.title}
                        width={24}
                        height={24}
                        className="w-6 h-6"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const parent = target.parentNode as HTMLElement;
                          if (parent) {
                            target.style.display = 'none';
                            const iconDiv = document.createElement('div');
                            iconDiv.innerHTML = `
                              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                            `;
                            parent.appendChild(iconDiv);
                          }
                        }}
                      />
                    </div>
                    <span className="text-6xl lg:text-8xl font-black text-gray-200 dark:text-gray-700/30">
                      {index + 1}
                    </span>
                  </div>
                  
                  <h2 className="step-title text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white">
                    {step.title}
                  </h2>
                  
                  <p className="step-description text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                  
                  <div className="pt-4">
                    <span className={`inline-block h-1 w-20 bg-gradient-to-r ${step.color} rounded-full`}></span>
                  </div>
                  
                  {/* Call to action específico para cada paso */}
                  <div className="pt-6">
                    <motion.a
                      href={index === steps.length - 1 ? "/auth/register" : "/main/explorar"}
                      className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${step.color} text-white rounded-full text-lg font-semibold shadow-lg transition-all duration-300`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {index === 0 && (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          Explorar espacios
                        </>
                      )}
                      {index === 1 && (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Buscar horarios
                        </>
                      )}
                      {index === 2 && (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Probar reserva
                        </>
                      )}
                      {index === 3 && (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                          Crear cuenta
                        </>
                      )}
                    </motion.a>
                  </div>
                </div>
                
                {/* Imagen o ilustración del paso */}
                <div className="step-image flex-1 h-80 md:h-96 w-full max-w-xl overflow-hidden rounded-2xl shadow-xl transform hover:scale-[1.02] transition-transform duration-300">
                  {imagesLoaded[index] ? (
                    <div className="relative w-full h-full">
                      <Image 
                        src={step.image}
                        alt={step.title}
                        className="object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ) : (
                    <ImageFallback color={step.color} />
                  )}
                </div>
              </div>
              
              {/* Indicador de navegación */}
              {index < steps.length - 1 && (
                <div className="absolute right-6 top-1/2 transform -translate-y-1/2 hidden lg:block">
                  <motion.div
                    className="w-12 h-12 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center text-gray-800 dark:text-gray-200 cursor-pointer shadow-lg backdrop-blur-sm"
                    animate={{ x: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Controles de navegación fijos */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 lg:hidden">
          <div className="flex gap-3 px-4 py-3 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-lg backdrop-blur-sm">
            {steps.map((_, idx) => (
              <button
                key={`control-${idx}`}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeStep === idx 
                    ? 'bg-emerald-500 scale-125' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
                aria-label={`Ir al paso ${idx + 1}`}
                onClick={() => {
                  // Calcular la posición en el scroll para este paso
                  const scrollTriggerInstance = ScrollTrigger.getById('horizontal-scroll');
                  if (scrollTriggerInstance) {
                    const progress = idx / (steps.length - 1);
                    const startPosition = scrollTriggerInstance.start;
                    const endPosition = scrollTriggerInstance.end;
                    const scrollPosition = startPosition + (endPosition - startPosition) * progress;
                    
                    gsap.to(window, {
                      scrollTo: scrollPosition,
                      duration: 1,
                      ease: 'power2.inOut'
                    });
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section - Attractive & Action-oriented */}
      <div className="cta-section relative p-8 md:p-16 rounded-3xl overflow-hidden mt-12">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/90 to-blue-600/90 dark:from-emerald-600/90 dark:to-blue-700/90"></div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3"></div>
        </div>
        
        <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            ¿Listo para empezar a jugar?
          </h2>
          
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
            Únete a miles de deportistas que ya disfrutan de los mejores espacios deportivos.
            Tu próximo partido está a solo unos clics de distancia.
          </p>
          
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="/main/explorar"
              className="px-8 py-4 bg-white hover:bg-gray-100 text-emerald-600 rounded-full text-lg font-semibold shadow-lg transition-all duration-300 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explorar espacios
            </motion.a>
            
            <motion.a
              href="/auth/register"
              className="px-8 py-4 bg-transparent hover:bg-white/10 text-white border-2 border-white/70 rounded-full text-lg font-semibold transition-all duration-300 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Crear cuenta
            </motion.a>
          </div>
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="py-12 mt-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Lo que dicen nuestros usuarios
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
          {[
            {
              name: "Carlos Rodríguez",
              role: "Jugador de fútbol amateur",
              quote: "Gracias a JuegaMás he podido encontrar canchas cercanas a mi casa. El proceso de reserva es muy sencillo e intuitivo.",
              image: "/avatars/user1.webp"
            },
            {
              name: "Laura Fernández",
              role: "Tenista profesional",
              quote: "Como profesional, necesito espacios de calidad para entrenar. JuegaMás me ha permitido encontrar las mejores canchas de tenis.",
              image: "/avatars/user2.webp"
            },
            {
              name: "Miguel Torres",
              role: "Propietario de complejo deportivo",
              quote: "Desde que listamos nuestro complejo deportivo en JuegaMás, nuestras reservas han aumentado significativamente.",
              image: "/avatars/user3.webp"
            }
          ].map((testimonial, idx) => (
            <motion.div 
              key={idx}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <svg className="text-emerald-500 h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow">
                  {testimonial.quote}
                </p>
                
                <div className="flex items-center mt-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 