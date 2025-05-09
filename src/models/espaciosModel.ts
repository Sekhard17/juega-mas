import supabase from '@/lib/supabaseClient';
import { EspacioDeportivo, FiltrosEspacios, PaginacionEspacios } from '@/types/espacio';

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
      return tiposUnicos;
    } catch (error) {
      console.error('Error al obtener tipos de espacios:', error);
      return [];
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
      return caracteristicasUnicas;
    } catch (error) {
      console.error('Error al obtener características:', error);
      return [];
    }
  }
}; 