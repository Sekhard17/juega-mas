import Image from "next/image";
import Link from "next/link";
import SearchBar from "../../../components/home/SearchBar";
import HeroCarousel from "../../../components/home/HeroCarousel";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-20 sm:pt-32 sm:pb-32 overflow-hidden">
        {/* Hero Carousel como fondo principal */}
        <div className="absolute inset-0 z-0">
          <HeroCarousel />
        </div>
        
        {/* Overlay adicional para asegurar buen contraste */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-teal-800/30 to-emerald-950/50 z-10">
          {/* Patrones decorativos */}
          <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern-bg.png')]"></div>
          
          {/* Círculos decorativos */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-400 dark:bg-emerald-700 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-400 dark:bg-teal-700 rounded-full opacity-20 blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
          {/* Contenido de texto centrado */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              <span className="block">Encuentra y reserva</span>
              <span className="block mt-2 text-emerald-200">espacios deportivos</span>
              <span className="block mt-2">desde donde quieras</span>
            </h1>
            <p className="mt-6 text-xl text-white text-opacity-90 max-w-2xl mx-auto">
              JuegaMás te conecta con los mejores espacios deportivos cerca de ti. Reserva canchas, gimnasios y más con solo unos clics.
            </p>
          </div>
          
          {/* Buscador al estilo Airbnb */}
          <SearchBar />
          

          
          {/* Botones de acción */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/como-funciona" className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all duration-300 text-center transform hover:-translate-y-1 uppercase tracking-wider">
              Cómo funciona
            </Link>
            <Link href="/propietarios" className="px-8 py-4 bg-white text-emerald-600 font-bold rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300 text-center transform hover:-translate-y-1 uppercase tracking-wider">
              Soy propietario
            </Link>
          </div>
          
          {/* Estadísticas */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-sm text-emerald-100 mt-1 uppercase tracking-wider">Espacios disponibles</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <p className="text-3xl font-bold text-white">15k+</p>
              <p className="text-sm text-emerald-100 mt-1 uppercase tracking-wider">Usuarios activos</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <p className="text-3xl font-bold text-white">10+</p>
              <p className="text-sm text-emerald-100 mt-1 uppercase tracking-wider">Deportes</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <p className="text-3xl font-bold text-white">4.8</p>
              <p className="text-sm text-emerald-100 mt-1 uppercase tracking-wider">Calificación promedio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Por qué elegirnos - 3 cards modernas */}
      <section className="py-20 sm:py-32 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
              ¿Por qué elegir JuegaMás?
            </h2>
            <p className="mt-6 max-w-2xl text-xl text-gray-600 dark:text-gray-300 mx-auto">
              Descubre cómo transformamos la forma de reservar espacios deportivos
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-3">
            {/* Card 1: Experiencia sin complicaciones */}
            <div className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="p-8 sm:p-10">
                <div className="flex items-center justify-center w-16 h-16 mb-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 shadow-lg">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-emerald-500 transition-colors duration-300">
                  Experiencia sin complicaciones
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                  Desde la búsqueda hasta la reserva, todo el proceso es intuitivo y rápido. Encuentra el espacio perfecto, reserva en segundos y juega sin preocupaciones.
                </p>
                
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-700 dark:text-gray-200">
                    <svg className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Búsqueda inteligente por ubicación
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-200">
                    <svg className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Filtros avanzados por deporte y precio
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-200">
                    <svg className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Reservas confirmadas al instante
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 2: Confianza y seguridad */}
            <div className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="p-8 sm:p-10">
                <div className="flex items-center justify-center w-16 h-16 mb-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 shadow-lg">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-emerald-500 transition-colors duration-300">
                  Confianza y seguridad
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                  Cada espacio deportivo es verificado por nuestro equipo. Pagos seguros, reseñas reales y soporte dedicado para una experiencia sin preocupaciones.
                </p>
                
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-700 dark:text-gray-200">
                    <svg className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Espacios verificados y de calidad
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-200">
                    <svg className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pagos 100% seguros y transparentes
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-200">
                    <svg className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Reseñas verificadas de usuarios reales
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 3: Tecnología a tu servicio */}
            <div className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="p-8 sm:p-10">
                <div className="flex items-center justify-center w-16 h-16 mb-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 shadow-lg">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-emerald-500 transition-colors duration-300">
                  Tecnología a tu servicio
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                  Nuestra plataforma utiliza tecnología de vanguardia para ofrecerte disponibilidad en tiempo real, notificaciones instantáneas y una experiencia fluida.
                </p>
                
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-700 dark:text-gray-200">
                    <svg className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Disponibilidad actualizada en tiempo real
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-200">
                    <svg className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Notificaciones y recordatorios automáticos
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-200">
                    <svg className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Gestión completa desde cualquier dispositivo
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Móvil */}
      <section className="py-20 sm:py-32 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
        {/* Elementos decorativos modernos */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-400/30 to-teal-500/20 dark:from-emerald-700/30 dark:to-teal-800/20 rounded-full opacity-70 blur-3xl -translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-teal-400/30 to-emerald-500/20 dark:from-teal-700/30 dark:to-emerald-800/20 rounded-full opacity-70 blur-3xl translate-x-1/3 translate-y-1/3"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Contenido de texto */}
            <div className="text-center md:text-left md:pr-8">
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl leading-tight">
                <span className="block">Lleva JuegaMás</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">en tu bolsillo</span>
              </h2>
              
              <p className="mt-6 text-xl text-gray-600 dark:text-gray-300">
                Descarga nuestra aplicación móvil y reserva espacios deportivos desde cualquier lugar, en cualquier momento.
              </p>
              
              <ul className="mt-8 space-y-4">
                <li className="flex items-center text-gray-700 dark:text-gray-200">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 flex items-center justify-center mr-3">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Reservas con un solo toque</span>
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-200">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 flex items-center justify-center mr-3">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Notificaciones instantáneas</span>
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-200">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 flex items-center justify-center mr-3">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Gestión de tus reservas en tiempo real</span>
                </li>
              </ul>
              
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a href="#" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 transition-colors duration-300 shadow-lg hover:shadow-xl">
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.523 15.6659L3.93404 24L13.0425 12L3.93404 0L17.523 8.33414C19.1478 9.30128 19.1478 14.6988 17.523 15.6659Z" fill="#32DE84"/>
                    <path d="M0.477783 0L13.0425 12L0.477783 24V0Z" fill="#0090E1"/>
                    <path d="M0.477783 0L3.93404 0L13.0425 12L3.93404 24L0.477783 24V0Z" fill="#283593"/>
                    <path d="M3.93408 24L17.5231 15.6659C18.3355 15.1823 18.7417 14.0764 18.7417 12.7059L24.0002 9.64709L15.6943 5.29413C15.6943 5.29413 7.38849 0.941162 3.93408 0L0.477783 0V24H3.93408Z" fill="#32DE84"/>
                    <path d="M18.7418 12.7059V12.7059L24.0002 9.64709L15.6943 5.29413C15.6943 5.29413 7.38849 0.941162 3.93408 0H3.93408L13.0426 12L3.93408 24H3.93408L17.5231 15.6659C18.3355 15.1823 18.7418 14.0764 18.7418 12.7059Z" fill="#00C7FF"/>
                  </svg>
                  Google Play
                </a>
                <a href="#" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 transition-colors duration-300 shadow-lg hover:shadow-xl">
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.4266 12.3137C16.4094 9.63654 18.8111 8.15979 18.9207 8.09474C17.5411 6.05325 15.4052 5.79558 14.6522 5.77416C12.8679 5.58416 11.1436 6.85187 10.2393 6.85187C9.31357 6.85187 7.91107 5.79558 6.39286 5.81701C4.40143 5.83844 2.56786 6.93416 1.57714 8.6513C-0.487857 12.1558 1.04571 17.5987 2.99714 20.5344C3.98786 21.9584 5.13357 23.5558 6.65179 23.5129C8.12857 23.4701 8.71071 22.5872 10.4951 22.5872C12.258 22.5872 12.8187 23.5129 14.3583 23.4915C15.9409 23.4701 16.9316 22.0461 17.8787 20.613C19.0244 18.9513 19.4987 17.3111 19.5159 17.2254C19.4773 17.2039 16.4437 16.0653 16.4266 12.3137Z" fill="#222222"/>
                    <path d="M13.6052 3.70557C14.4009 2.71485 14.9402 1.36292 14.7902 0C13.6266 0.0428623 12.1927 0.771433 11.3756 1.74072C10.6441 2.60629 9.99337 3.99736 10.1648 5.32787C11.4738 5.41435 12.7881 4.67507 13.6052 3.70557Z" fill="#222222"/>
                  </svg>
                  App Store
                </a>
              </div>
            </div>
            
            {/* Imagen del dispositivo móvil */}
            <div className="relative mt-12 md:mt-0">
              <div className="relative mx-auto w-full max-w-xs">
                {/* Efecto de brillo detrás del teléfono */}
                <div className="absolute inset-0 transform translate-x-4 translate-y-4">
                  <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-300 dark:from-emerald-600 dark:to-teal-500 rounded-3xl blur-xl opacity-50"></div>
                </div>
                
                {/* Teléfono */}
                <div className="relative bg-gray-900 rounded-[3rem] overflow-hidden border-8 border-gray-800 shadow-2xl transform transition-all duration-500 hover:scale-105">
                  {/* Notch del teléfono */}
                  <div className="absolute top-0 inset-x-0 h-6 bg-gray-800 rounded-b-xl z-10 flex justify-center items-end pb-1">
                    <div className="w-20 h-1.5 bg-gray-600 rounded-full"></div>
                  </div>
                  
                  {/* Pantalla */}
                  <div className="pt-8 pb-2 h-[500px] relative overflow-hidden">
                    <Image
                      src="/images/app-screenshot.jpg"
                      alt="JuegaMás App"
                      width={280}
                      height={500}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay con gradiente para dar profundidad */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/20 pointer-events-none"></div>
                  </div>
                  
                  {/* Botón home */}
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-600 rounded-full"></div>
                </div>
                
                {/* Elementos decorativos flotantes */}
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-emerald-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-teal-500 rounded-full opacity-20 animate-pulse delay-700"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 relative overflow-hidden">
        {/* Fondo con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-700 dark:from-emerald-800 dark:to-teal-900">
          {/* Patrones decorativos */}
          <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern-bg.png')]"></div>
          
          {/* Elementos decorativos */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400 dark:bg-emerald-700 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-400 dark:bg-teal-700 rounded-full opacity-20 blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                <span className="block">¿Tienes un</span>
                <span className="block mt-2 text-emerald-200">espacio deportivo?</span>
              </h2>
              <p className="mt-6 text-xl text-white text-opacity-90 max-w-2xl mx-auto md:mx-0">
                Únete a JuegaMás y comienza a recibir reservas en línea. Gestiona tu espacio de manera eficiente y aumenta tus ingresos.
              </p>
              
              <div className="mt-10">
                <Link 
                  href="/propietarios" 
                  className="inline-flex items-center px-8 py-4 border border-transparent text-base font-bold rounded-lg shadow-lg text-emerald-600 bg-white hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1 uppercase tracking-wider"
                >
                  REGISTRA TU ESPACIO
                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              
              <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="ml-2 text-white">Sin comisiones iniciales</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="ml-2 text-white">Soporte personalizado</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="ml-2 text-white">Gestión simplificada</span>
                </div>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="relative">
                {/* Imagen principal */}
                <div className="relative mx-auto w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border-4 border-white transform rotate-3">
                  <Image
                    src="/images/propietario.jpg"
                    alt="Propietario de espacio deportivo"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                </div>
                
                {/* Elementos decorativos */}
                <div className="absolute top-4 -left-4 bg-white rounded-lg shadow-lg p-4 transform -rotate-6 z-10">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">+30% de ingresos</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4 transform rotate-6 z-10">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">+15k usuarios activos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
