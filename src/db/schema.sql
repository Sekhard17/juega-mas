-- Tabla para mensajes de contacto
CREATE TABLE mensajes_contacto (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  asunto TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  leido BOOLEAN DEFAULT FALSE,
  respondido BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mensajes_contacto
CREATE INDEX idx_mensajes_contacto_email ON mensajes_contacto(email);
CREATE INDEX idx_mensajes_contacto_leido ON mensajes_contacto(leido);
CREATE INDEX idx_mensajes_contacto_created_at ON mensajes_contacto(created_at);

-- Trigger para actualizar la fecha de actualización
CREATE TRIGGER actualizar_mensajes_contacto_timestamp
BEFORE UPDATE ON mensajes_contacto
FOR EACH ROW EXECUTE PROCEDURE actualizar_timestamp(); 