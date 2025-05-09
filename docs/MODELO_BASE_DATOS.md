# 🗃️ Modelo de Base de Datos - JuegaMás

## 📊 Esquema de Base de Datos

Este documento describe el esquema de base de datos para la plataforma JuegaMás, implementado en PostgreSQL a través de Supabase.

### Convenciones

- Claves primarias: `id` (tipo UUID)
- Timestamps automáticos: `created_at`, `updated_at`
- Relaciones: claves foráneas con sufijo `_id`
- Nombres en español, snake_case
- Políticas RLS (Row Level Security) implementadas para seguridad

## 📋 Tablas Principales

### usuarios

```sql
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  telefono TEXT,
  foto_perfil TEXT,
  role TEXT NOT NULL DEFAULT 'usuario', -- 'usuario', 'propietario', 'admin'
  password_hash TEXT, -- Si usamos auth propia
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_role ON usuarios(role);
```

### espacios_deportivos

```sql
CREATE TABLE espacios_deportivos (
  id SERIAL PRIMARY KEY,
  propietario_id INTEGER NOT NULL REFERENCES usuarios(id),
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL, -- 'futbol', 'tenis', 'padel', 'basquet', etc.
  descripcion TEXT,
  direccion TEXT NOT NULL,
  ciudad TEXT NOT NULL,
  estado TEXT,
  codigo_postal TEXT,
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  precio_base DECIMAL(10, 2) NOT NULL,
  capacidad_min INT,
  capacidad_max INT,
  duracion_turno INT NOT NULL, -- en minutos (60, 90, 120, etc.)
  imagen_principal TEXT,
  estado_espacio TEXT NOT NULL DEFAULT 'activo', -- 'activo', 'inactivo', 'pendiente'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_espacios_deportivos_propietario ON espacios_deportivos(propietario_id);
CREATE INDEX idx_espacios_deportivos_tipo ON espacios_deportivos(tipo);
CREATE INDEX idx_espacios_deportivos_ciudad ON espacios_deportivos(ciudad);
CREATE INDEX idx_espacios_deportivos_estado ON espacios_deportivos(estado_espacio);
CREATE INDEX idx_espacios_coords ON espacios_deportivos(latitud, longitud);
```

### imagenes_espacios

```sql
CREATE TABLE imagenes_espacios (
  id SERIAL PRIMARY KEY,
  espacio_id INTEGER NOT NULL REFERENCES espacios_deportivos(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  orden INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_imagenes_espacio ON imagenes_espacios(espacio_id);
```

### caracteristicas_espacios

```sql
CREATE TABLE caracteristicas_espacios (
  id SERIAL PRIMARY KEY,
  espacio_id INTEGER NOT NULL REFERENCES espacios_deportivos(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL, -- 'vestuarios', 'iluminacion', 'estacionamiento', etc.
  valor TEXT, -- 'si/no' o valor específico
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_caracteristicas_espacio ON caracteristicas_espacios(espacio_id);
```

### horarios_disponibilidad

```sql
CREATE TABLE horarios_disponibilidad (
  id SERIAL PRIMARY KEY,
  espacio_id INTEGER NOT NULL REFERENCES espacios_deportivos(id) ON DELETE CASCADE,
  dia_semana INT NOT NULL, -- 0=domingo, 1=lunes, ..., 6=sábado
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  disponible BOOLEAN DEFAULT true,
  precio_especial DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Restricción para asegurar horarios válidos
  CONSTRAINT hora_fin_despues_inicio CHECK (hora_fin > hora_inicio)
);

-- Índices
CREATE INDEX idx_horarios_espacio ON horarios_disponibilidad(espacio_id);
CREATE INDEX idx_horarios_dia ON horarios_disponibilidad(dia_semana);
```

### bloqueos_fechas

```sql
CREATE TABLE bloqueos_fechas (
  id SERIAL PRIMARY KEY,
  espacio_id INTEGER NOT NULL REFERENCES espacios_deportivos(id) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  hora_inicio TIME,
  hora_fin TIME,
  motivo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Para bloqueos de día completo, hora_inicio y hora_fin pueden ser NULL
  CONSTRAINT bloqueo_horario_valido 
    CHECK ((hora_inicio IS NULL AND hora_fin IS NULL) OR (hora_inicio < hora_fin))
);

-- Índices
CREATE INDEX idx_bloqueos_espacio ON bloqueos_fechas(espacio_id);
CREATE INDEX idx_bloqueos_fecha ON bloqueos_fechas(fecha);
```

### reservas

```sql
CREATE TABLE reservas (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
  espacio_id INTEGER NOT NULL REFERENCES espacios_deportivos(id),
  fecha DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  precio_total DECIMAL(10, 2) NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente', -- 'pendiente', 'confirmada', 'cancelada', 'completada'
  codigo_reserva TEXT UNIQUE NOT NULL,
  notas TEXT,
  metodo_pago TEXT,
  id_transaccion TEXT,
  cancelado_por INTEGER REFERENCES usuarios(id),
  motivo_cancelacion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Restricciones
  CONSTRAINT hora_fin_despues_inicio CHECK (hora_fin > hora_inicio)
);

-- Índices
CREATE INDEX idx_reservas_usuario ON reservas(usuario_id);
CREATE INDEX idx_reservas_espacio ON reservas(espacio_id);
CREATE INDEX idx_reservas_fecha ON reservas(fecha);
CREATE INDEX idx_reservas_estado ON reservas(estado);
CREATE INDEX idx_reservas_codigo ON reservas(codigo_reserva);
```

### reseñas

```sql
CREATE TABLE reseñas (
  id SERIAL PRIMARY KEY,
  reserva_id INTEGER UNIQUE REFERENCES reservas(id),
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
  espacio_id INTEGER NOT NULL REFERENCES espacios_deportivos(id),
  puntuacion INT NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
  comentario TEXT,
  respuesta TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_reseñas_usuario ON reseñas(usuario_id);
CREATE INDEX idx_reseñas_espacio ON reseñas(espacio_id);
CREATE INDEX idx_reseñas_reserva ON reseñas(reserva_id);
```

### notificaciones

```sql
CREATE TABLE notificaciones (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
  tipo TEXT NOT NULL, -- 'reserva_confirmada', 'reserva_cancelada', etc.
  titulo TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  leida BOOLEAN DEFAULT false,
  datos JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_notificaciones_usuario ON notificaciones(usuario_id);
CREATE INDEX idx_notificaciones_leida ON notificaciones(leida);
CREATE INDEX idx_notificaciones_creada ON notificaciones(created_at);
```

## 🔒 Políticas RLS (Row Level Security)

### Políticas para Usuarios

```sql
-- Habilitar RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Los usuarios pueden ver su propio perfil
CREATE POLICY usuarios_select_own ON usuarios
  FOR SELECT USING (auth.uid() = id);

-- Los usuarios pueden actualizar su propio perfil
CREATE POLICY usuarios_update_own ON usuarios
  FOR UPDATE USING (auth.uid() = id);

-- Los administradores pueden ver todos los perfiles
CREATE POLICY admin_select_all ON usuarios
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND role = 'admin')
  );
```

### Políticas para Espacios Deportivos

```sql
-- Habilitar RLS
ALTER TABLE espacios_deportivos ENABLE ROW LEVEL SECURITY;

-- Todos pueden ver espacios deportivos activos
CREATE POLICY espacios_select_public ON espacios_deportivos
  FOR SELECT USING (estado_espacio = 'activo');

-- Los propietarios pueden gestionar sus propios espacios
CREATE POLICY espacios_crud_own ON espacios_deportivos
  USING (propietario_id = auth.uid());
  
-- Los administradores pueden gestionar todos los espacios
CREATE POLICY espacios_crud_admin ON espacios_deportivos
  USING (
    EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND role = 'admin')
  );
```

### Políticas para Reservas

```sql
-- Habilitar RLS
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;

-- Los usuarios pueden ver sus propias reservas
CREATE POLICY reservas_select_own ON reservas
  FOR SELECT USING (usuario_id = auth.uid());

-- Los propietarios pueden ver reservas de sus espacios
CREATE POLICY reservas_select_owner ON reservas
  FOR SELECT USING (
    espacio_id IN (
      SELECT id FROM espacios_deportivos WHERE propietario_id = auth.uid()
    )
  );
  
-- Los usuarios pueden crear reservas
CREATE POLICY reservas_insert_users ON reservas
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND usuario_id = auth.uid()
  );
```

## 🔄 Funciones y Triggers

### Actualización de timestamps

```sql
-- Función para actualizar timestamps
CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para usuarios
CREATE TRIGGER actualizar_usuarios_timestamp
BEFORE UPDATE ON usuarios
FOR EACH ROW EXECUTE PROCEDURE actualizar_timestamp();

-- Trigger para espacios_deportivos
CREATE TRIGGER actualizar_espacios_timestamp
BEFORE UPDATE ON espacios_deportivos
FOR EACH ROW EXECUTE PROCEDURE actualizar_timestamp();

-- Trigger para reservas
CREATE TRIGGER actualizar_reservas_timestamp
BEFORE UPDATE ON reservas
FOR EACH ROW EXECUTE PROCEDURE actualizar_timestamp();
```

### Verificación de Disponibilidad

```sql
-- Función para verificar disponibilidad antes de crear una reserva
CREATE OR REPLACE FUNCTION verificar_disponibilidad()
RETURNS TRIGGER AS $$
DECLARE
  existe_reserva BOOLEAN;
  existe_bloqueo BOOLEAN;
  dia INT;
  existe_horario BOOLEAN;
BEGIN
  -- Obtener día de la semana (0=domingo, 1=lunes, etc.)
  dia := EXTRACT(DOW FROM NEW.fecha);
  
  -- Verificar si existe otra reserva en el mismo horario
  SELECT EXISTS (
    SELECT 1 FROM reservas
    WHERE espacio_id = NEW.espacio_id
      AND fecha = NEW.fecha
      AND estado NOT IN ('cancelada')
      AND (
        (hora_inicio <= NEW.hora_inicio AND hora_fin > NEW.hora_inicio) OR
        (hora_inicio < NEW.hora_fin AND hora_fin >= NEW.hora_fin) OR
        (hora_inicio >= NEW.hora_inicio AND hora_fin <= NEW.hora_fin)
      )
  ) INTO existe_reserva;
  
  -- Verificar si existe un bloqueo en esa fecha/horario
  SELECT EXISTS (
    SELECT 1 FROM bloqueos_fechas
    WHERE espacio_id = NEW.espacio_id
      AND fecha = NEW.fecha
      AND (
        (hora_inicio IS NULL AND hora_fin IS NULL) OR
        (hora_inicio <= NEW.hora_inicio AND hora_fin > NEW.hora_inicio) OR
        (hora_inicio < NEW.hora_fin AND hora_fin >= NEW.hora_fin) OR
        (hora_inicio >= NEW.hora_inicio AND hora_fin <= NEW.hora_fin)
      )
  ) INTO existe_bloqueo;
  
  -- Verificar si existe un horario disponible para ese día y hora
  SELECT EXISTS (
    SELECT 1 FROM horarios_disponibilidad
    WHERE espacio_id = NEW.espacio_id
      AND dia_semana = dia
      AND hora_inicio <= NEW.hora_inicio
      AND hora_fin >= NEW.hora_fin
      AND disponible = true
  ) INTO existe_horario;
  
  -- Si hay reserva o bloqueo o no hay horario disponible, rechazar
  IF existe_reserva OR existe_bloqueo OR NOT existe_horario THEN
    RAISE EXCEPTION 'Horario no disponible para reserva';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger antes de insertar una reserva
CREATE TRIGGER verificar_disponibilidad_reserva
BEFORE INSERT ON reservas
FOR EACH ROW EXECUTE PROCEDURE verificar_disponibilidad();
```

## 📈 Vistas

### Vista de Disponibilidad

```sql
CREATE OR REPLACE VIEW vista_disponibilidad AS
SELECT 
  ed.id AS espacio_id,
  ed.nombre AS espacio_nombre,
  ed.tipo,
  hd.dia_semana,
  hd.hora_inicio,
  hd.hora_fin,
  COALESCE(hd.precio_especial, ed.precio_base) AS precio,
  ed.duracion_turno,
  ed.propietario_id
FROM espacios_deportivos ed
JOIN horarios_disponibilidad hd ON ed.id = hd.espacio_id
WHERE ed.estado_espacio = 'activo' AND hd.disponible = true;
```

### Vista de Reservas Completa

```sql
CREATE OR REPLACE VIEW vista_reservas_completa AS
SELECT 
  r.id,
  r.codigo_reserva,
  r.fecha,
  r.hora_inicio,
  r.hora_fin,
  r.precio_total,
  r.estado,
  r.created_at,
  u.id AS usuario_id,
  u.nombre AS usuario_nombre,
  u.email AS usuario_email,
  u.telefono AS usuario_telefono,
  ed.id AS espacio_id,
  ed.nombre AS espacio_nombre,
  ed.tipo AS espacio_tipo,
  ed.direccion AS espacio_direccion,
  ed.ciudad AS espacio_ciudad,
  p.id AS propietario_id,
  p.nombre AS propietario_nombre,
  p.email AS propietario_email
FROM reservas r
JOIN usuarios u ON r.usuario_id = u.id
JOIN espacios_deportivos ed ON r.espacio_id = ed.id
JOIN usuarios p ON ed.propietario_id = p.id;
```

### Vista de Estadísticas de Espacios

```sql
CREATE OR REPLACE VIEW vista_estadisticas_espacios AS
SELECT 
  ed.id,
  ed.nombre,
  ed.tipo,
  ed.propietario_id,
  COUNT(r.id) AS total_reservas,
  SUM(CASE WHEN r.estado = 'completada' THEN 1 ELSE 0 END) AS reservas_completadas,
  SUM(CASE WHEN r.estado = 'cancelada' THEN 1 ELSE 0 END) AS reservas_canceladas,
  SUM(CASE WHEN r.estado = 'pendiente' THEN 1 ELSE 0 END) AS reservas_pendientes,
  SUM(r.precio_total) AS ingresos_totales,
  COALESCE(AVG(res.puntuacion), 0) AS puntuacion_promedio,
  COUNT(res.id) AS total_reseñas
FROM espacios_deportivos ed
LEFT JOIN reservas r ON ed.id = r.espacio_id
LEFT JOIN reseñas res ON ed.id = res.espacio_id
GROUP BY ed.id, ed.nombre, ed.tipo, ed.propietario_id;
```

## 🚀 Consideraciones de Escalabilidad

- Indices bien definidos para consultas frecuentes
- Particionamiento de tablas para datos históricos de reservas
- Posible implementación de búsqueda de texto completo para filtros
- Implementación de funciones SQL para lógica de negocio compleja
- Uso de transacciones para operaciones críticas (reservas)
- Políticas de RLS optimizadas para minimizar el impacto en rendimiento 