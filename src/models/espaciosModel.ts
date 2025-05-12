import supabase from '@/lib/supabaseClient';
import { EspacioDeportivo, FiltrosEspacios, PaginacionEspacios, Caracteristica, ImagenEspacio, HorarioDisponibilidad } from '@/types/espacio';

// Tipos predefinidos de espacios deportivos
const TIPOS_ESPACIOS_PREDEFINIDOS = [
  'Fútbol 5',
  'Fútbol 7',
  'Fútbol 11',
  'Básquetbol',
  'Vóley',
  'Tenis',
  'Pádel',
  'Gimnasio',
  'Natación',
  'Crossfit',
  'Sala multideporte',
  'Hockey',
  'Rugby',
  'Otro'
];

// Características predefinidas para espacios deportivos
const CARACTERISTICAS_PREDEFINIDAS = [
  'Estacionamiento',
  'Vestuarios',
  'Duchas',
  'Iluminación',
  'Baños',
  'Cafetería',
  'Wifi',
  'Gradas para espectadores',
  'Acceso para discapacitados',
  'Césped natural',
  'Césped sintético',
  'Superficie de madera',
  'Superficie de cemento',
  'Superficie de arcilla',
  'Techo cubierto',
  'Canchas techadas',
  'Aire acondicionado',
  'Calefacción',
  'Alquiler de equipamiento',
  'Instructor disponible',
  'Casilleros',
  'Servicio de toallas',
  'Bar/restaurante',
  'Área de calentamiento',
  'Marcador electrónico',
  'Sistema de sonido',
  'Seguridad',
  'Primeros auxilios'
];

export const espaciosModel = {
  /**
   * Obtener un listado paginado de espacios deportivos con filtros
   */
  async listarEspacios(filtros: FiltrosEspacios = {}): Promise<{ espacios: EspacioDeportivo[], paginacion: PaginacionEspacios }> {
    try {
      const {
        busqueda,
        tipo,
        ciudad,
        precio_min,
        precio_max,
        capacidad_min,
        ordenar_por,
        page = 1,
        per_page = 10
      } = filtros;

      let query = supabase
        .from('espacios_deportivos')
        .select(`
          *,
          caracteristicas_espacios (*),
          imagenes_espacios (*)
        `, { count: 'exact' })
        .eq('estado_espacio', 'activo');
      
      // Aplicar filtros si están presentes
      if (busqueda) {
        query = query.or(`nombre.ilike.%${busqueda}%,descripcion.ilike.%${busqueda}%`);
      }
      
      if (tipo) {
        query = query.eq('tipo', tipo);
      }
      
      if (ciudad) {
        query = query.eq('ciudad', ciudad);
      }
      
      if (precio_min !== undefined) {
        query = query.gte('precio_base', precio_min);
      }
      
      if (precio_max !== undefined) {
        query = query.lte('precio_base', precio_max);
      }
      
      if (capacidad_min !== undefined) {
        query = query.gte('capacidad_min', capacidad_min);
      }
      
      // Aplicar ordenamiento
      if (ordenar_por) {
        switch (ordenar_por) {
          case 'precio_asc':
            query = query.order('precio_base', { ascending: true });
            break;
          case 'precio_desc':
            query = query.order('precio_base', { ascending: false });
            break;
          case 'calificacion':
            // En la versión final se puede usar la vista de estadísticas
            query = query.order('id', { ascending: false });
            break;
          case 'popularidad':
            // Por defecto usaremos los más recientes como proxy de popularidad
            query = query.order('created_at', { ascending: false });
            break;
        }
      } else {
        // Ordenamiento por defecto: más recientes primero
        query = query.order('created_at', { ascending: false });
      }
      
      // Paginación
      const desde = (page - 1) * per_page;
      query = query.range(desde, desde + per_page - 1);
      
      const { data: espacios, error, count } = await query;
      
      if (error) throw error;
      
      // Procesar los datos para ajustarlos al tipo EspacioDeportivo
      const espaciosProcesados = espacios.map(espacio => {
        // Usar type assertion para manejar las propiedades dinámicas
        const espacioAny = espacio as any;
        
        const procesado: EspacioDeportivo = {
          ...espacio as any, // cast necesario para evitar errores de TS
          caracteristicas: espacioAny.caracteristicas_espacios || [],
          imagenes: espacioAny.imagenes_espacios || [],
          puntuacion_promedio: 0, // Valor por defecto
          total_resenas: 0 // Valor por defecto (cambiado para evitar la ñ)
        };
        
        // Eliminar propiedades anidadas que ya fueron procesadas
        delete (procesado as any).caracteristicas_espacios;
        delete (procesado as any).imagenes_espacios;
        
        return procesado;
      });
      
      // En un segundo paso, obtener las puntuaciones promedio
      // Esta es una solución provisional mientras se ajusta la consulta principal
      const idsEspacios = espaciosProcesados.map(e => e.id);
      if (idsEspacios.length > 0) {
        const { data: estadisticas } = await supabase
          .from('vista_estadisticas_espacios')
          .select('id, puntuacion_promedio, total_resenas') // Cambiado para evitar la ñ
          .in('id', idsEspacios);
          
        if (estadisticas) {
          estadisticas.forEach((est: any) => {
            const espacio = espaciosProcesados.find(e => e.id === est.id);
            if (espacio) {
              espacio.puntuacion_promedio = est.puntuacion_promedio || 0;
              espacio.total_resenas = est.total_resenas || 0; // Cambiado para evitar la ñ
            }
          });
        }
      }
      
      const paginacion: PaginacionEspacios = {
        total: count || 0,
        pagina_actual: page,
        total_paginas: Math.ceil((count || 0) / per_page),
        por_pagina: per_page
      };
      
      return {
        espacios: espaciosProcesados,
        paginacion
      };
    } catch (error) {
      console.error('Error al listar espacios deportivos:', error);
      return {
        espacios: [],
        paginacion: {
          total: 0,
          pagina_actual: 1,
          total_paginas: 0,
          por_pagina: 10
        }
      };
    }
  },

  /**
   * Obtener detalle de un espacio deportivo por ID
   */
  async obtenerEspacio(id: number): Promise<EspacioDeportivo | null> {
    try {
      const { data, error } = await supabase
        .from('espacios_deportivos')
        .select(`
          *,
          caracteristicas_espacios (*),
          imagenes_espacios (*),
          horarios_disponibilidad (*)
        `)
        .eq('id', id)
        .eq('estado_espacio', 'activo')
        .single();
      
      if (error) throw error;
      
      if (!data) return null;
      
      // Obtener puntuación promedio desde la vista
      const { data: estadisticas } = await supabase
        .from('vista_estadisticas_espacios')
        .select('puntuacion_promedio, total_resenas') // Cambiado para evitar la ñ
        .eq('id', id)
        .single();
      
      // Usar type assertion para manejar las propiedades dinámicas
      const dataAny = data as any;
      
      // Procesar los datos para ajustarlos al tipo EspacioDeportivo
      const espacioProcesado: EspacioDeportivo = {
        ...data as any, // cast necesario para evitar errores de TS
        caracteristicas: dataAny.caracteristicas_espacios || [],
        imagenes: dataAny.imagenes_espacios || [],
        horarios: dataAny.horarios_disponibilidad || [],
        puntuacion_promedio: estadisticas?.puntuacion_promedio || 0,
        total_resenas: estadisticas?.total_resenas || 0 // Cambiado para evitar la ñ
      };
      
      // Eliminar propiedades anidadas que ya fueron procesadas
      delete (espacioProcesado as any).caracteristicas_espacios;
      delete (espacioProcesado as any).imagenes_espacios;
      delete (espacioProcesado as any).horarios_disponibilidad;
      
      return espacioProcesado;
    } catch (error) {
      console.error('Error al obtener detalle del espacio deportivo:', error);
      return null;
    }
  },

  /**
   * Obtener tipos de espacios deportivos (para filtros)
   */
  async obtenerTiposEspacios(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('espacios_deportivos')
        .select('tipo')
        .eq('estado_espacio', 'activo')
        .order('tipo');
      
      if (error) throw error;
      
      // Extraer tipos únicos
      const tiposUnicos = [...new Set(data.map(item => item.tipo))];
      
      // Si no hay tipos en la base de datos o son muy pocos, devolver los predefinidos
      if (tiposUnicos.length < 3) {
        return TIPOS_ESPACIOS_PREDEFINIDOS;
      }
      
      return tiposUnicos;
    } catch (error) {
      console.error('Error al obtener tipos de espacios:', error);
      // En caso de error, devolver los tipos predefinidos
      return TIPOS_ESPACIOS_PREDEFINIDOS;
    }
  },

  /**
   * Obtener ciudades disponibles (para filtros)
   */
  async obtenerCiudades(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('espacios_deportivos')
        .select('ciudad')
        .eq('estado_espacio', 'activo')
        .order('ciudad');
      
      if (error) throw error;
      
      // Extraer ciudades únicas
      const ciudadesUnicas = [...new Set(data.map(item => item.ciudad))];
      return ciudadesUnicas;
    } catch (error) {
      console.error('Error al obtener ciudades:', error);
      return [];
    }
  },

  /**
   * Obtener características disponibles (para filtros)
   */
  async obtenerCaracteristicas(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('caracteristicas_espacios')
        .select('nombre')
        .order('nombre');
      
      if (error) throw error;
      
      // Extraer características únicas
      const caracteristicasUnicas = [...new Set(data.map(item => item.nombre))];
      
      // Si no hay características en la base de datos o son muy pocas, devolver las predefinidas
      if (caracteristicasUnicas.length < 5) {
        return CARACTERISTICAS_PREDEFINIDAS;
      }
      
      return caracteristicasUnicas;
    } catch (error) {
      console.error('Error al obtener características:', error);
      // En caso de error, devolver las características predefinidas
      return CARACTERISTICAS_PREDEFINIDAS;
    }
  },

  /**
   * Obtener todos los espacios de un propietario
   */
  async getEspaciosByPropietario(propietarioId: number) {
    try {
      const { data, error } = await supabase
        .from('espacios_deportivos')
        .select(`
          *,
          imagenes_espacios(*),
          caracteristicas_espacios(*),
          vista_estadisticas_espacios!inner(total_reservas, reservas_completadas, puntuacion_promedio, ingresos_totales)
        `)
        .eq('propietario_id', propietarioId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error al obtener espacios por propietario:', error);
      return { data: null, error };
    }
  },

  /**
   * Obtener un espacio específico por ID
   */
  async getEspacioById(espacioId: number) {
    try {
      const { data, error } = await supabase
        .from('espacios_deportivos')
        .select(`
          *,
          imagenes_espacios(*),
          caracteristicas_espacios(*),
          horarios_disponibilidad(*)
        `)
        .eq('id', espacioId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error al obtener espacio por ID:', error);
      return { data: null, error };
    }
  },

  /**
   * Obtener estadísticas de un espacio específico
   */
  async getEstadisticasEspacio(espacioId: number) {
    try {
      const { data, error } = await supabase
        .rpc('obtener_estadisticas_espacio', { espacio_id_param: espacioId });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error al obtener estadísticas del espacio:', error);
      return { data: null, error };
    }
  },

  /**
   * Crear un nuevo espacio deportivo
   */
  async createEspacio(espacioData: any) {
    try {
      // Crear el espacio básico
      const { data, error } = await supabase
        .from('espacios_deportivos')
        .insert(espacioData)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error al crear espacio deportivo:', error);
      return { data: null, error };
    }
  },

  /**
   * Agregar características a un espacio deportivo
   */
  async addCaracteristicas(espacioId: number, caracteristicas: {nombre: string, valor: string}[]) {
    try {
      const caracteristicasData = caracteristicas.map(c => ({
        espacio_id: espacioId,
        nombre: c.nombre,
        valor: c.valor
      }));
      
      const { data, error } = await supabase
        .from('caracteristicas_espacios')
        .insert(caracteristicasData)
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error al agregar características:', error);
      return { data: null, error };
    }
  },

  /**
   * Eliminar característica de un espacio
   */
  async deleteCaracteristica(caracteristicaId: number) {
    try {
      const { error } = await supabase
        .from('caracteristicas_espacios')
        .delete()
        .eq('id', caracteristicaId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error al eliminar característica:', error);
      return { error };
    }
  },

  /**
   * Actualizar un espacio deportivo
   */
  async updateEspacio(espacioId: number, espacioData: any) {
    try {
      const { data, error } = await supabase
        .from('espacios_deportivos')
        .update(espacioData)
        .eq('id', espacioId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error al actualizar espacio deportivo:', error);
      return { data: null, error };
    }
  },

  /**
   * Eliminar un espacio deportivo
   */
  async deleteEspacio(espacioId: number) {
    try {
      const { error } = await supabase
        .from('espacios_deportivos')
        .delete()
        .eq('id', espacioId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error al eliminar espacio deportivo:', error);
      return { error };
    }
  },

  /**
   * Agregar imágenes a un espacio deportivo
   */
  async addImagenes(espacioId: number, imagenes: {url: string, orden: number}[]) {
    try {
      const imagenesData = imagenes.map(img => ({
        espacio_id: espacioId,
        url: img.url,
        orden: img.orden
      }));
      
      const { data, error } = await supabase
        .from('imagenes_espacios')
        .insert(imagenesData)
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error al agregar imágenes:', error);
      return { data: null, error };
    }
  },

  /**
   * Eliminar imagen de un espacio
   */
  async deleteImagen(imagenId: number) {
    try {
      const { error } = await supabase
        .from('imagenes_espacios')
        .delete()
        .eq('id', imagenId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      return { error };
    }
  },

  /**
   * Agregar horarios de disponibilidad a un espacio
   */
  async addHorarios(espacioId: number, horarios: Omit<HorarioDisponibilidad, 'id'>[]) {
    try {
      const horariosData = horarios.map(h => ({
        espacio_id: espacioId,
        dia_semana: h.dia_semana,
        hora_inicio: h.hora_inicio,
        hora_fin: h.hora_fin,
        disponible: h.disponible,
        precio_especial: h.precio_especial
      }));
      
      const { data, error } = await supabase
        .from('horarios_disponibilidad')
        .insert(horariosData)
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error al agregar horarios:', error);
      return { data: null, error };
    }
  },

  /**
   * Actualizar un horario de disponibilidad
   */
  async updateHorario(horarioId: number, horarioData: Partial<HorarioDisponibilidad>) {
    try {
      const { data, error } = await supabase
        .from('horarios_disponibilidad')
        .update(horarioData)
        .eq('id', horarioId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error al actualizar horario:', error);
      return { data: null, error };
    }
  },

  /**
   * Eliminar un horario de disponibilidad
   */
  async deleteHorario(horarioId: number) {
    try {
      const { error } = await supabase
        .from('horarios_disponibilidad')
        .delete()
        .eq('id', horarioId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error al eliminar horario:', error);
      return { error };
    }
  }
}; 