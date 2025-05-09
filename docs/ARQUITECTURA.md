# 🏗️ Arquitectura Técnica - JuegaMás

## 📋 Visión General de la Arquitectura

JuegaMás sigue una arquitectura moderna basada en Next.js con API Routes y Supabase como backend, siguiendo principios de serverless y API-first.

```
┌─────────────────────────────────────┐
│                                     │
│              FRONTEND               │
│                                     │
│    ┌─────────┐       ┌─────────┐    │
│    │ Landing │       │  App    │    │
│    │ Pages   │       │ Pages   │    │
│    └─────────┘       └─────────┘    │
│                                     │
└───────────────┬─────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│                                     │
│              API ROUTES             │
│                                     │
│    ┌─────────┐       ┌─────────┐    │
│    │  Auth   │       │ CRUD    │    │
│    │ Handlers│       │ Handlers│    │
│    └─────────┘       └─────────┘    │
│                                     │
└───────────────┬─────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│                                     │
│              SUPABASE               │
│                                     │
│    ┌─────────┐       ┌─────────┐    │
│    │Database │       │ Storage │    │
│    │(Postgres)│       │ Buckets │    │
│    └─────────┘       └─────────┘    │
│                                     │
│    ┌─────────────────────────┐      │
│    │      Realtime           │      │
│    └─────────────────────────┘      │
│                                     │
└─────────────────────────────────────┘
```

## 🛠️ Stack Tecnológico Detallado

### Frontend

- **Next.js 14 (App Router)**
  - Framework React con SSR/SSG/ISR
  - Routing basado en sistema de archivos
  - Componentes del servidor y del cliente

- **Tailwind CSS + shadcn/ui**
  - Sistema de diseño utilitario
  - Componentes reutilizables accesibles
  - Theming personalizado y responsive

- **Gestión de Estado**
  - Zustand para estado global
  - React Context para estados localizados
  - SWR/TanStack Query para fetch y caché de datos

- **Formularios y Validación**
  - React Hook Form para manejo de formularios
  - Zod para validación de esquemas
  - Uncontrolled inputs para mejor rendimiento

### Backend

- **Next.js API Routes**
  - Endpoints serverless
  - Middleware para autenticación y autorización
  - Handlers para operaciones CRUD

- **Autenticación Personalizada**
  - JWT con HttpOnly cookies
  - Sistema de roles (usuario, propietario, admin)
  - Middleware de protección de rutas

- **Supabase**
  - PostgreSQL como base de datos principal
  - Row Level Security (RLS) para seguridad
  - Storage para imágenes y archivos
  - Realtime para actualizaciones en vivo

### Integración de Datos

- **Capa de Acceso a Datos**
  - Cliente Supabase para frontend (anónimo)
  - Cliente Supabase Admin para backend (elevado)
  - Tipos generados desde la base de datos

- **API Handlers**
  - Validación de entrada con Zod
  - Respuestas tipadas
  - Manejo consistente de errores

## 🔄 Flujo de Datos

### Flujo de Solicitud Típico

1. **Cliente Solicita Datos**
   - Componente React solicita datos vía SWR/TanStack Query
   - Se incluye token JWT en la solicitud

2. **API Route Procesa Solicitud**
   - Middleware valida JWT y extrae información del usuario
   - Handler valida parámetros de entrada
   - Se realiza operación en Supabase con permisos elevados

3. **Supabase Ejecuta Operación**
   - Query en PostgreSQL
   - Aplicación de RLS si es necesario
   - Retorno de resultados

4. **API Route Formatea Respuesta**
   - Transformación de datos si es necesario
   - Envío de respuesta al cliente

5. **Cliente Actualiza UI**
   - Actualización del estado local
   - Re-renderizado de componentes

### Flujo de Autenticación

1. **Login/Registro**
   - Usuario envía credenciales
   - API valida credenciales
   - Genera JWT y lo almacena en cookie HttpOnly
   - Devuelve información de usuario

2. **Verificación de Sesión**
   - Middleware valida JWT en cada solicitud protegida
   - Rechaza o permite acceso según rol y permisos

3. **Refresh Token**
   - Proceso automático para renovar JWT antes de expirar
   - Mantiene la sesión de usuario activa

## 📦 Estructura de Carpetas

```
juegamas/
├── app/
│   ├── (landing)/                # Páginas públicas
│   │   ├── page.tsx              # Homepage
│   │   └── canchas/
│   │       ├── [id]/
│   │       │   └── page.tsx      # Detalle público de cancha
│   │       └── page.tsx          # Listado de canchas
│   ├── (auth)/                   # Páginas de autenticación
│   │   ├── login/
│   │   ├── registro/
│   │   └── recuperar-password/
│   ├── (app)/                    # Páginas de usuario logueado
│   │   ├── reservas/
│   │   ├── perfil/
│   │   └── layout.tsx            # Layout protegido con navbar
│   ├── (propietario)/            # Panel propietario
│   │   ├── espacios/
│   │   ├── reservas/
│   │   └── estadisticas/
│   ├── (admin)/                  # Panel admin
│   ├── api/                      # Backend API Routes
│   │   ├── auth/
│   │   ├── canchas/
│   │   ├── reservas/
│   │   └── webhooks/
│   └── layout.tsx                # Root layout
├── components/                   # Componentes React
│   ├── ui/                       # Componentes base (shadcn)
│   ├── auth/                     # Componentes de autenticación
│   ├── canchas/                  # Componentes específicos de canchas
│   ├── reservas/                 # Componentes de reservas
│   └── layout/                   # Headers, footers, etc.
├── lib/                          # Utilidades y lógica
│   ├── auth/                     # Lógica de autenticación
│   │   ├── cookies.ts            # Manejo de cookies
│   │   ├── jwt.ts                # Utilidades JWT
│   │   └── middleware.ts         # Middleware de autenticación
│   ├── supabase/                 # Cliente Supabase
│   │   ├── client.ts             # Cliente frontend (anónimo)
│   │   ├── admin.ts              # Cliente backend (elevado)
│   │   └── types.ts              # Tipos generados
│   ├── validators/               # Esquemas Zod
│   ├── hooks/                    # Custom hooks
│   └── utils/                    # Utilidades generales
├── store/                        # Estado global (Zustand)
├── public/                       # Archivos estáticos
├── middleware.ts                 # Next.js middleware
├── next.config.js
└── tailwind.config.js
```

## 🛡️ Seguridad

### Autenticación y Autorización

- **JWT (JSON Web Tokens)**
  - Almacenados en cookies HttpOnly
  - Refresh tokens para sesiones duraderas
  - CSRF protection

- **Middleware de Protección**
  - Validación de rutas basada en roles
  - Autorización granular en API endpoints

- **Row Level Security en Supabase**
  - Políticas a nivel de fila para proteger datos
  - Acceso controlado según roles y propiedad

### Validación de Datos

- **Validación en Frontend**
  - Esquemas Zod para validar formularios
  - Feedback inmediato al usuario

- **Validación en Backend**
  - Esquemas Zod para validar payloads de API
  - Sanitización de inputs

- **Seguridad en Base de Datos**
  - Prepared statements para prevenir SQL injection
  - Validaciones a nivel de base de datos

## 🚀 Escalabilidad y Rendimiento

### Estrategias de Caché

- **ISR (Incremental Static Regeneration)**
  - Páginas estáticas regeneradas periódicamente
  - Excelente para listados y detalles de canchas

- **SWR/TanStack Query**
  - Caché de datos en cliente
  - Revalidación automática
  - Optimistic Updates para mejor UX

- **Edge Caching**
  - Vercel Edge Network para distribuir contenido

### Optimización de Rendimiento

- **Componentes Server/Client**
  - Uso de React Server Components donde sea adecuado
  - Menos JavaScript enviado al cliente

- **Lazy Loading**
  - Carga diferida de componentes grandes
  - Imágenes optimizadas con next/image

- **Bundle Optimization**
  - Code splitting automático
  - Tree-shaking

### Arquitectura para Escalar

- **Serverless**
  - API Routes escalables automáticamente
  - Sin mantenimiento de servidores

- **Diseño de Base de Datos**
  - Índices optimizados
  - Vistas materializadas para consultas complejas
  - Consultas eficientes

## 📱 Estrategia Móvil

### Enfoque para Fase Inicial

- **Diseño Responsive**
  - Mobile-first con Tailwind
  - Optimizado para todos los tamaños de pantalla

- **PWA (Progressive Web App)**
  - Instalable en dispositivos móviles
  - Funcionalidad offline básica
  - Web Push Notifications

### App Nativa (Fase Posterior)

- **React Native**
  - Componentes compartidos con web donde sea posible
  - SDK de Supabase para React Native
  - Autenticación persistente

## 🔄 Integración con Servicios Externos

- **Pasarelas de Pago**
  - Stripe / MercadoPago
  - Flow (Chile)
  - Webhooks para actualización de estado

- **Notificaciones**
  - Email transaccional (Resend/SendGrid)
  - SMS (Twilio)
  - Push Notifications (OneSignal)

- **Mapas**
  - Mapbox / Google Maps
  - Geocoding para búsqueda por ubicación

## 🧪 Testing

- **Testing Unitario**
  - Vitest para funciones y utilidades
  - React Testing Library para componentes

- **Testing de Integración**
  - MSW para mock de API
  - Testing de flujos completos

- **E2E Testing**
  - Playwright para pruebas end-to-end
  - Cobertura de flujos críticos (reserva, pago)

## 📊 Monitoreo y Analítica

- **Logging**
  - Vercel Logs
  - LogTail para centralización

- **Error Tracking**
  - Sentry para captura y análisis de errores

- **Analítica**
  - Google Analytics / Plausible
  - Eventos personalizados para flujos críticos

## 🚢 Despliegue y CI/CD

- **Entornos**
  - Desarrollo (local)
  - Staging (para pruebas)
  - Producción

- **CI/CD con GitHub Actions**
  - Tests automáticos en PR
  - Preview deployments
  - Despliegue automático a producción

- **Infraestructura**
  - Vercel para frontend y API Routes
  - Supabase para base de datos y storage
  - CDN para assets estáticos 