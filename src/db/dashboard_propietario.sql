-- =======================================================
-- VISTAS ADICIONALES PARA DASHBOARD DE PROPIETARIO
-- =======================================================

-- Vista para estadísticas diarias de espacios
CREATE OR REPLACE VIEW vista_estadisticas_diarias AS
SELECT 
  ed.id AS espacio_id,
  ed.nombre AS espacio_nombre,
  ed.propietario_id,
  CURRENT_DATE AS fecha,
  COUNT(r.id) AS reservas_hoy,
  SUM(r.precio_total) AS ganancias_dia,
  (
    SELECT tipo_espacio
    FROM (
      SELECT e.tipo AS tipo_espacio, COUNT(r2.id) AS total
      FROM espacios_deportivos e
      JOIN reservas r2 ON e.id = r2.espacio_id
      WHERE e.propietario_id = ed.propietario_id
        AND r2.fecha = CURRENT_DATE
      GROUP BY e.tipo
      ORDER BY total DESC
      LIMIT 1
    ) AS subq
  ) AS tipo_popular,
  (
    SELECT hora_inicio::TEXT
    FROM (
      SELECT r3.hora_inicio, COUNT(*) AS total
      FROM reservas r3
      JOIN espacios_deportivos e3 ON r3.espacio_id = e3.id
      WHERE e3.propietario_id = ed.propietario_id
        AND r3.fecha = CURRENT_DATE
      GROUP BY r3.hora_inicio
      ORDER BY total DESC
      LIMIT 1
    ) AS subq2
  ) AS horario_popular
FROM espacios_deportivos ed
LEFT JOIN reservas r ON ed.id = r.espacio_id AND r.fecha = CURRENT_DATE
WHERE r.estado NOT IN ('cancelada')
GROUP BY ed.id, ed.nombre, ed.propietario_id;

-- Vista para estadísticas mensuales de espacios
CREATE OR REPLACE VIEW vista_estadisticas_mensuales AS
SELECT 
  ed.id AS espacio_id,
  ed.nombre AS espacio_nombre,
  ed.propietario_id,
  EXTRACT(YEAR FROM CURRENT_DATE) AS año,
  EXTRACT(MONTH FROM CURRENT_DATE) AS mes,
  COUNT(r.id) AS reservas_totales,
  COUNT(DISTINCT r.fecha) AS dias_con_reservas,
  SUM(r.precio_total) AS ganancias_mes,
  COALESCE(AVG(res.puntuacion), 0) AS puntuacion_promedio,
  COUNT(res.id) AS total_reseñas
FROM espacios_deportivos ed
LEFT JOIN reservas r ON ed.id = r.espacio_id 
  AND EXTRACT(YEAR FROM r.fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
  AND EXTRACT(MONTH FROM r.fecha) = EXTRACT(MONTH FROM CURRENT_DATE)
  AND r.estado NOT IN ('cancelada')
LEFT JOIN reseñas res ON ed.id = res.espacio_id
  AND EXTRACT(YEAR FROM res.created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
  AND EXTRACT(MONTH FROM res.created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
GROUP BY ed.id, ed.nombre, ed.propietario_id;

-- Vista para ocupación de espacios
CREATE OR REPLACE VIEW vista_ocupacion_espacios AS
SELECT 
  ed.id AS espacio_id,
  ed.nombre AS espacio_nombre,
  ed.propietario_id,
  COUNT(DISTINCT hd.id) AS total_horarios_disponibles,
  COUNT(DISTINCT r.id) AS total_reservas_semana,
  (COUNT(DISTINCT r.id)::FLOAT / NULLIF(COUNT(DISTINCT hd.id), 0)) * 100 AS porcentaje_ocupacion
FROM espacios_deportivos ed
LEFT JOIN horarios_disponibilidad hd ON ed.id = hd.espacio_id AND hd.disponible = true
LEFT JOIN reservas r ON ed.id = r.espacio_id 
  AND r.fecha BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '7 days')
  AND r.estado NOT IN ('cancelada')
GROUP BY ed.id, ed.nombre, ed.propietario_id;

-- Vista para tendencias de reservas por día de semana
CREATE OR REPLACE VIEW vista_tendencias_dias AS
SELECT 
  ed.id AS espacio_id,
  ed.nombre AS espacio_nombre,
  ed.propietario_id,
  EXTRACT(DOW FROM r.fecha) AS dia_semana,
  COUNT(r.id) AS total_reservas,
  SUM(r.precio_total) AS total_ganancias
FROM espacios_deportivos ed
JOIN reservas r ON ed.id = r.espacio_id
WHERE r.fecha >= (CURRENT_DATE - INTERVAL '30 days')
  AND r.estado NOT IN ('cancelada')
GROUP BY ed.id, ed.nombre, ed.propietario_id, EXTRACT(DOW FROM r.fecha)
ORDER BY dia_semana;

-- Vista para tendencias de reservas por hora
CREATE OR REPLACE VIEW vista_tendencias_horas AS
SELECT 
  ed.id AS espacio_id,
  ed.nombre AS espacio_nombre,
  ed.propietario_id,
  r.hora_inicio,
  COUNT(r.id) AS total_reservas
FROM espacios_deportivos ed
JOIN reservas r ON ed.id = r.espacio_id
WHERE r.fecha >= (CURRENT_DATE - INTERVAL '30 days')
  AND r.estado NOT IN ('cancelada')
GROUP BY ed.id, ed.nombre, ed.propietario_id, r.hora_inicio
ORDER BY total_reservas DESC;

-- Vista para resumen de propietario
CREATE OR REPLACE VIEW vista_resumen_propietario AS
SELECT 
  u.id AS propietario_id,
  u.nombre AS propietario_nombre,
  COUNT(DISTINCT ed.id) AS total_espacios,
  SUM(r.precio_total) AS ganancias_totales,
  COUNT(DISTINCT r.id) AS total_reservas,
  COUNT(DISTINCT CASE WHEN r.fecha = CURRENT_DATE THEN r.id END) AS reservas_hoy,
  SUM(CASE WHEN r.fecha = CURRENT_DATE THEN r.precio_total ELSE 0 END) AS ganancias_hoy,
  COUNT(DISTINCT CASE WHEN r.fecha BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '7 days') THEN r.id END) AS reservas_proxima_semana,
  COALESCE(AVG(res.puntuacion), 0) AS calificacion_promedio
FROM usuarios u
LEFT JOIN espacios_deportivos ed ON u.id = ed.propietario_id
LEFT JOIN reservas r ON ed.id = r.espacio_id AND r.estado NOT IN ('cancelada')
LEFT JOIN reseñas res ON ed.id = res.espacio_id
WHERE u.role = 'propietario'
GROUP BY u.id, u.nombre;

-- Crear función para obtener estadísticas de un espacio específico
CREATE OR REPLACE FUNCTION obtener_estadisticas_espacio(espacio_id_param INTEGER)
RETURNS TABLE (
  reservas_hoy BIGINT,
  ganancias_dia NUMERIC,
  cancha_popular TEXT,
  horario_popular TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(r.id) AS reservas_hoy,
    COALESCE(SUM(r.precio_total), 0) AS ganancias_dia,
    (
      SELECT ed2.nombre
      FROM espacios_deportivos ed2
      JOIN reservas r2 ON ed2.id = r2.espacio_id
      WHERE ed2.propietario_id = (SELECT propietario_id FROM espacios_deportivos WHERE id = espacio_id_param)
        AND r2.fecha = CURRENT_DATE
      GROUP BY ed2.id, ed2.nombre
      ORDER BY COUNT(r2.id) DESC
      LIMIT 1
    ) AS cancha_popular,
    (
      SELECT r3.hora_inicio::TEXT
      FROM reservas r3
      WHERE r3.espacio_id = espacio_id_param
        AND r3.fecha >= (CURRENT_DATE - INTERVAL '30 days')
      GROUP BY r3.hora_inicio
      ORDER BY COUNT(*) DESC
      LIMIT 1
    ) AS horario_popular
  FROM espacios_deportivos ed
  LEFT JOIN reservas r ON ed.id = r.espacio_id AND r.fecha = CURRENT_DATE AND r.estado NOT IN ('cancelada')
  WHERE ed.id = espacio_id_param;
END;
$$ LANGUAGE plpgsql; 