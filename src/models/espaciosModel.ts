import { API_ROUTES } from '@/lib/apiConfig';
import { EspacioDeportivo, FiltrosEspacios, PaginacionEspacios } from '@/types/espacio';

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
  'Otro'
];

export const espaciosModel = {
  /**
   * Obtener un listado paginado de espacios deportivos con filtros
   */
  async listarEspacios(filtros: FiltrosEspacios = {}): Promise<{ espacios: EspacioDeportivo[], paginacion: PaginacionEspacios }> {
    try {
      // Construir la URL con los parámetros de filtro
      const params = new URLSearchParams();
      
      if (filtros.busqueda) params.append('busqueda', filtros.busqueda);
      if (filtros.tipo) params.append('tipo', filtros.tipo);
      if (filtros.ciudad) params.append('ciudad', filtros.ciudad);
      if (filtros.precio_min !== undefined) params.append('precio_min', filtros.precio_min.toString());
      if (filtros.precio_max !== undefined) params.append('precio_max', filtros.precio_max.toString());
      if (filtros.capacidad_min !== undefined) params.append('capacidad_min', filtros.capacidad_min.toString());
      if (filtros.ordenar_por) params.append('ordenar_por', filtros.ordenar_por);
      
      // Parámetros de paginación
      params.append('page', (filtros.page || 1).toString());
      params.append('per_page', (filtros.per_page || 10).toString());
      
      const url = `${API_ROUTES.ESPACIOS.LIST}?${params.toString()}`;
      
      // Realizar la solicitud
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Error al obtener espacios deportivos');
      }
      
      const espacios = await response.json();
      
      // Retornamos el resultado con la estructura esperada
      return {
        espacios,
        paginacion: {
          total: espacios.length,
          pagina_actual: filtros.page || 1,
          total_paginas: Math.ceil(espacios.length / (filtros.per_page || 10)),
          por_pagina: filtros.per_page || 10
        }
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
   * Obtener información detallada de un espacio deportivo
   */
  async obtenerEspacio(espacioId: number): Promise<EspacioDeportivo | null> {
    try {
      const url = API_ROUTES.ESPACIOS.DETAIL(espacioId);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error al obtener espacio deportivo ${espacioId}`);
      }
      
      const espacio = await response.json();
      return espacio;
    } catch (error) {
      console.error(`Error al obtener espacio deportivo ${espacioId}:`, error);
      return null;
    }
  },

  /**
   * Alias de obtenerEspacio - Obtiene un espacio por su ID
   */
  async getEspacioById(espacioId: number): Promise<{ data: EspacioDeportivo | null; error: any }> {
    try {
      const espacio = await this.obtenerEspacio(espacioId);
      return { data: espacio, error: null };
    } catch (error) {
      console.error(`Error al obtener espacio deportivo ${espacioId}:`, error);
      return { data: null, error };
    }
  },

  /**
   * Obtener disponibilidad horaria de un espacio para una fecha específica
   */
  async obtenerDisponibilidad(espacioId: number, fecha: string): Promise<any> {
    try {
      // Este endpoint aún no existe en la API, usar endpoint específico cuando esté disponible
      const url = `${API_ROUTES.ESPACIOS.DETAIL(espacioId)}/disponibilidad?fecha=${fecha}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error al obtener disponibilidad del espacio ${espacioId}`);
      }
      
      const disponibilidad = await response.json();
      return disponibilidad;
    } catch (error) {
      console.error(`Error al obtener disponibilidad del espacio ${espacioId}:`, error);
      return [];
    }
  },

  /**
   * Obtener ciudades disponibles (para filtros)
   */
  async obtenerCiudades(): Promise<string[]> {
    try {
      // Este endpoint aún no existe en la API, implementar cuando esté disponible
      const url = `${API_ROUTES.ESPACIOS.LIST}/ciudades`;
      const response = await fetch(url);
      
      if (!response.ok) {
        return [];
      }
      
      const ciudades = await response.json();
      return ciudades as string[];
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
      // Este endpoint aún no existe en la API, implementar cuando esté disponible
      const url = `${API_ROUTES.ESPACIOS.LIST}/caracteristicas`;
      const response = await fetch(url);
      
      if (!response.ok) {
        return CARACTERISTICAS_PREDEFINIDAS;
      }
      
      const caracteristicas = await response.json();
      if (Array.isArray(caracteristicas) && caracteristicas.length >= 5) {
        return caracteristicas as string[];
      }
      return CARACTERISTICAS_PREDEFINIDAS;
    } catch (error) {
      console.error('Error al obtener características:', error);
      return CARACTERISTICAS_PREDEFINIDAS;
    }
  },

  /**
   * Obtener tipos de espacios deportivos (para filtros)
   */
  async obtenerTiposEspacios(): Promise<string[]> {
    try {
      // Este endpoint aún no existe en la API, implementar cuando esté disponible
      const url = `${API_ROUTES.ESPACIOS.LIST}/tipos`;
      const response = await fetch(url);
      
      if (!response.ok) {
        return TIPOS_ESPACIOS_PREDEFINIDOS;
      }
      
      const tipos = await response.json();
      if (Array.isArray(tipos) && tipos.length >= 3) {
        return tipos as string[];
      }
      return TIPOS_ESPACIOS_PREDEFINIDOS;
    } catch (error) {
      console.error('Error al obtener tipos de espacios:', error);
      return TIPOS_ESPACIOS_PREDEFINIDOS;
    }
  },

  /**
   * Obtener todos los espacios de un propietario
   */
  async getEspaciosByPropietario(propietarioId: number) {
    try {
      const url = API_ROUTES.PROPIETARIO.ESPACIOS;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener espacios del propietario');
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error('Error al obtener espacios por propietario:', error);
      return { data: null, error };
    }
  },

  /**
   * Crear un nuevo espacio deportivo
   */
  async createEspacio(espacioData: any) {
    try {
      const url = API_ROUTES.ESPACIOS.CREATE;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify(espacioData)
      });
      
      if (!response.ok) {
        throw new Error('Error al crear espacio deportivo');
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error('Error al crear espacio:', error);
      return { data: null, error };
    }
  },

  /**
   * Agregar características a un espacio deportivo
   */
  async addCaracteristicas(espacioId: number, caracteristicas: Array<{nombre: string, valor: string}>) {
    try {
      const url = `${API_ROUTES.ESPACIOS.UPDATE(espacioId)}/caracteristicas`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify({ caracteristicas })
      });
      
      if (!response.ok) {
        throw new Error(`Error al agregar características al espacio ${espacioId}`);
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error(`Error al agregar características al espacio ${espacioId}:`, error);
      return { data: null, error };
    }
  },

  /**
   * Agregar imágenes a un espacio deportivo
   */
  async addImagenes(espacioId: number, imagenes: Array<{url: string, orden: number}>) {
    try {
      const url = `${API_ROUTES.ESPACIOS.UPDATE(espacioId)}/imagenes`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify({ imagenes })
      });
      
      if (!response.ok) {
        throw new Error(`Error al agregar imágenes al espacio ${espacioId}`);
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error(`Error al agregar imágenes al espacio ${espacioId}:`, error);
      return { data: null, error };
    }
  },

  /**
   * Agregar horarios a un espacio deportivo
   */
  async addHorarios(espacioId: number, horarios: Array<{dia_semana: number, hora_inicio: string, hora_fin: string, disponible: boolean, precio_especial?: number}>) {
    try {
      const url = `${API_ROUTES.ESPACIOS.UPDATE(espacioId)}/horarios`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify({ horarios })
      });
      
      if (!response.ok) {
        throw new Error(`Error al agregar horarios al espacio ${espacioId}`);
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error(`Error al agregar horarios al espacio ${espacioId}:`, error);
      return { data: null, error };
    }
  },

  /**
   * Actualizar un espacio existente
   */
  async updateEspacio(espacioId: number, espacioData: any) {
    try {
      const url = API_ROUTES.ESPACIOS.UPDATE(espacioId);
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify(espacioData)
      });
      
      if (!response.ok) {
        throw new Error(`Error al actualizar espacio deportivo ${espacioId}`);
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error(`Error al actualizar espacio ${espacioId}:`, error);
      return { data: null, error };
    }
  },

  /**
   * Eliminar un espacio deportivo
   */
  async deleteEspacio(espacioId: number) {
    try {
      const url = API_ROUTES.ESPACIOS.DELETE(espacioId);
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error al eliminar espacio deportivo ${espacioId}`);
      }
      
      return { success: true, error: null };
    } catch (error) {
      console.error(`Error al eliminar espacio ${espacioId}:`, error);
      return { success: false, error };
    }
  }
}; 