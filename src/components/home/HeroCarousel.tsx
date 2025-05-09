'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Imágenes para el carrusel (utilizaremos rutas relativas a la carpeta public)
const heroImages = [
  {
    src: '/images/futbol-hero.jpeg',
    alt: 'Cancha de fútbol',
    title: 'Fútbol',
    description: 'Encuentra las mejores canchas de fútbol cerca de ti'
  },
  {
    src: '/images/basquet-hero.jpg',
    alt: 'Cancha de básquetbol',
    title: 'Básquetbol',
    description: 'Canchas de básquetbol para todos los niveles'
  },
  {
    src: '/images/padel-hero.jpeg',
    alt: 'Cancha de pádel',
    title: 'Pádel',
    description: 'El deporte de moda al alcance de tu mano'
  }
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Cambiar automáticamente la imagen cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Función para ir a la imagen anterior
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
    );
  };
  
  // Función para ir a la imagen siguiente
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % heroImages.length
    );
  };
  
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Overlay de gradiente para mejorar la visibilidad del texto */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-emerald-900/50 to-black/30 z-10"></div>
      
      {/* Carrusel de imágenes */}
      <div className="relative w-full h-full">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover object-center transform scale-105 filter brightness-75"
              priority={index === 0}
              quality={90}
            />
          </div>
        ))}
      </div>
      
      {/* Texto sobre la imagen */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-20 text-white">
        <h2 className="text-3xl font-bold mb-2">{heroImages[currentIndex].title}</h2>
        <p className="text-lg text-white/90">{heroImages[currentIndex].description}</p>
      </div>
      
      {/* Botones de navegación */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors duration-300"
        aria-label="Imagen anterior"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors duration-300"
        aria-label="Imagen siguiente"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      {/* Indicadores de posición */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Ir a imagen ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
}
