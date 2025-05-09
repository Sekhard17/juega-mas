# 🔄 Diagrama Entidad-Relación - JuegaMás

## 📊 Modelo Conceptual

```mermaid
erDiagram
    USUARIO ||--o{ RESERVA : realiza
    USUARIO ||--o{ RESEÑA : escribe
    USUARIO ||--o{ ESPACIO_DEPORTIVO : administra
    ESPACIO_DEPORTIVO ||--o{ HORARIO_DISPONIBILIDAD : tiene
    ESPACIO_DEPORTIVO ||--o{ BLOQUEO_FECHA : posee
    ESPACIO_DEPORTIVO ||--o{ RESERVA : se_reserva
    ESPACIO_DEPORTIVO ||--o{ IMAGEN_ESPACIO : contiene
    ESPACIO_DEPORTIVO ||--o{ CARACTERISTICA_ESPACIO : incluye
    RESERVA ||--o| RESEÑA : genera
    RESERVA }o--|| NOTIFICACION : desencadena

    USUARIO {
        uuid id PK
        string email UK
        string nombre
        string telefono
        string foto_perfil
        string role
        string password_hash
        timestamp created_at
        timestamp updated_at
    }

    ESPACIO_DEPORTIVO {
        uuid id PK
        uuid propietario_id FK
        string nombre
        string tipo
        string descripcion
        string direccion
        string ciudad
        string estado
        string codigo_postal
        decimal latitud
        decimal longitud
        decimal precio_base
        integer capacidad_min
        integer capacidad_max
        integer duracion_turno
        string imagen_principal
        string estado_espacio
        timestamp created_at
        timestamp updated_at
    }

    HORARIO_DISPONIBILIDAD {
        uuid id PK
        uuid espacio_id FK
        integer dia_semana
        time hora_inicio
        time hora_fin
        boolean disponible
        decimal precio_especial
        timestamp created_at
        timestamp updated_at
    }

    BLOQUEO_FECHA {
        uuid id PK
        uuid espacio_id FK
        date fecha
        time hora_inicio
        time hora_fin
        string motivo
        timestamp created_at
    }

    RESERVA {
        uuid id PK
        uuid usuario_id FK
        uuid espacio_id FK
        date fecha
        time hora_inicio
        time hora_fin
        decimal precio_total
        string estado
        string codigo_reserva UK
        string notas
        string metodo_pago
        string id_transaccion
        uuid cancelado_por FK
        string motivo_cancelacion
        timestamp created_at
        timestamp updated_at
    }

    RESEÑA {
        uuid id PK
        uuid reserva_id FK
        uuid usuario_id FK
        uuid espacio_id FK
        integer puntuacion
        string comentario
        string respuesta
        timestamp created_at
        timestamp updated_at
    }

    IMAGEN_ESPACIO {
        uuid id PK
        uuid espacio_id FK
        string url
        integer orden
        timestamp created_at
    }

    CARACTERISTICA_ESPACIO {
        uuid id PK
        uuid espacio_id FK
        string nombre
        string valor
        timestamp created_at
    }

    NOTIFICACION {
        uuid id PK
        uuid usuario_id FK
        string tipo
        string titulo
        string mensaje
        boolean leida
        json datos
        timestamp created_at
    }
```

## 📈 Relaciones Principales

### 1️⃣ Usuario - Espacio Deportivo
- Un **Usuario** con rol "propietario" puede administrar **múltiples Espacios Deportivos**
- Un **Espacio Deportivo** pertenece a un **único Usuario propietario**

### 2️⃣ Espacio Deportivo - Horarios 
- Un **Espacio Deportivo** tiene **múltiples Horarios de Disponibilidad** (por día de semana)
- Un **Espacio Deportivo** puede tener **múltiples Bloqueos de Fecha** (excepciones)

### 3️⃣ Usuario - Reserva
- Un **Usuario** puede realizar **múltiples Reservas**
- Una **Reserva** pertenece a un **único Usuario**

### 4️⃣ Espacio Deportivo - Reserva
- Un **Espacio Deportivo** puede tener **múltiples Reservas**
- Una **Reserva** corresponde a un **único Espacio Deportivo**

### 5️⃣ Reserva - Reseña
- Una **Reserva** puede generar como máximo **una Reseña**
- Una **Reseña** pertenece a **una única Reserva**

### 6️⃣ Espacio Deportivo - Características/Imágenes
- Un **Espacio Deportivo** tiene **múltiples Características** (vestuarios, iluminación, etc.)
- Un **Espacio Deportivo** contiene **múltiples Imágenes**

## 🛡️ Restricciones de Integridad

### Claves Primarias
Todas las entidades utilizan identificadores UUID como clave primaria

### Claves Foráneas
- `ESPACIO_DEPORTIVO.propietario_id` → `USUARIO.id`
- `HORARIO_DISPONIBILIDAD.espacio_id` → `ESPACIO_DEPORTIVO.id`
- `BLOQUEO_FECHA.espacio_id` → `ESPACIO_DEPORTIVO.id`
- `RESERVA.usuario_id` → `USUARIO.id`
- `RESERVA.espacio_id` → `ESPACIO_DEPORTIVO.id`
- `RESERVA.cancelado_por` → `USUARIO.id`
- `RESEÑA.reserva_id` → `RESERVA.id`
- `RESEÑA.usuario_id` → `USUARIO.id`
- `RESEÑA.espacio_id` → `ESPACIO_DEPORTIVO.id`
- `IMAGEN_ESPACIO.espacio_id` → `ESPACIO_DEPORTIVO.id`
- `CARACTERISTICA_ESPACIO.espacio_id` → `ESPACIO_DEPORTIVO.id`
- `NOTIFICACION.usuario_id` → `USUARIO.id`

### Restricciones Adicionales
1. Horarios válidos: `hora_fin > hora_inicio` en `HORARIO_DISPONIBILIDAD` y `BLOQUEO_FECHA`
2. Puntuación en rango: `puntuacion BETWEEN 1 AND 5` en `RESEÑA`
3. Código único: `codigo_reserva` es único en `RESERVA`
4. Email único: `email` es único en `USUARIO`
5. Valores de estado: `estado` en `RESERVA` debe ser uno de ['pendiente', 'confirmada', 'cancelada', 'completada']
6. Bloqueo de fechas: Un bloqueo puede ser de día completo (`hora_inicio` y `hora_fin` ambos NULL) o de un rango específico

## 🧠 Lógica de Negocio Clave

### Verificación de Disponibilidad
Para crear una reserva válida se verifica:
1. Que no exista otra reserva en ese horario para el mismo espacio
2. Que no exista un bloqueo en esa fecha/horario
3. Que exista un horario disponible configurado para ese día y hora

### Actualización de Estado de Reserva
Cuando una reserva cambia de estado:
1. Se registra quién realiza la cancelación (si aplica)
2. Se genera una notificación para el usuario
3. Se actualiza la disponibilidad en tiempo real

### Cálculo de Precios
El precio de una reserva considera:
1. El precio base del espacio deportivo
2. Precios especiales configurados para días/horarios específicos
3. Duración de la reserva

## 🔍 Índices Principales

### Índices para Búsqueda
- `idx_espacios_deportivos_ciudad`: Para búsqueda por ubicación
- `idx_espacios_deportivos_tipo`: Para filtrado por tipo de espacio
- `idx_espacios_coords`: Para búsquedas geoespaciales
- `idx_horarios_dia`: Para búsqueda rápida de disponibilidad por día

### Índices para Relaciones
- `idx_reservas_usuario`: Para historial de reservas de usuario
- `idx_reservas_espacio`: Para reservas de un espacio específico
- `idx_reservas_fecha`: Para reservas en una fecha dada
- `idx_reseñas_espacio`: Para mostrar reseñas de un espacio

## 📱 Consideraciones UX/Rendimiento

1. Las vistas materializadas (`vista_disponibilidad`, `vista_reservas_completa`) optimizan consultas frecuentes
2. El sistema de notificaciones permite alertas en tiempo real cuando cambia el estado de reservas
3. Los bloqueos de fechas permiten gestionar excepciones (mantenimiento, días festivos)
4. Las características permiten filtros avanzados para usuarios
5. La estructura normalizada mantiene la integridad de datos mientras facilita consultas eficientes 