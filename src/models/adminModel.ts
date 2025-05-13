import { API_ROUTES } from '@/lib/apiConfig';

export interface AdminEstadisticas {
  totalClientes: number;
  totalPropietarios: number;
  totalRecintos: number;
  suscripcionesActivas: number;
  tendencias?: {
    clientes: { valor: number; esPositiva: boolean };
    propietarios: { valor: number; esPositiva: boolean };
    recintos: { valor: number; esPositiva: boolean };
    suscripciones: { valor: number; esPositiva: boolean };
  };
}

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  foto_perfil?: string;
  role: string;
  created_at: string;
  telefono?: string;
}

const adminModel = {
  async obtenerEstadisticas(): Promise<AdminEstadisticas> {
    try {
      const response = await fetch(API_ROUTES.ADMIN.ESTADISTICAS);
      if (!response.ok) {
        console.warn('API no disponible, devolviendo datos de ejemplo');
        // Estructura temporal sin datos simulados
        return {
          totalClientes: 0,
          totalPropietarios: 0,
          totalRecintos: 0,
          suscripcionesActivas: 0
        };
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener estadísticas de administrador:', error);
      // Estructura temporal en caso de error
      return {
        totalClientes: 0,
        totalPropietarios: 0,
        totalRecintos: 0,
        suscripcionesActivas: 0
      };
    }
  },

  /**
   * Obtener usuarios recientes
   * @param limite Número máximo de usuarios a obtener
   */
  async obtenerUsuariosRecientes(limite: number = 5): Promise<Usuario[]> {
    try {
      const url = `${API_ROUTES.ADMIN.USUARIOS.RECIENTES}?limite=${limite}`;
      const response = await fetch(url);
      
      // Si la API no está disponible, usamos Supabase directamente como fallback
      if (!response.ok) {
        console.warn('API no disponible, utilizando conexión directa a Supabase');
        // Importación dinámica para evitar cargar Supabase innecesariamente si la API está disponible
        const { default: supabase } = await import('@/lib/supabaseClient');
        
        const { data, error } = await supabase
          .from('usuarios')
          .select('id, nombre, email, foto_perfil, role, created_at, telefono')
          .order('created_at', { ascending: false })
          .limit(limite);
          
        if (error) throw error;
        return data || [];
      }
      
      const data = await response.json();
      return data.usuarios || [];
    } catch (error) {
      console.error('Error al obtener usuarios recientes:', error);
      return [];
    }
  },

  /**
   * Obtener listado paginado de usuarios
   * @param pagina Número de página
   * @param porPagina Elementos por página
   */
  async obtenerUsuarios(pagina: number = 1, porPagina: number = 10): Promise<Usuario[]> {
    try {
      const url = `${API_ROUTES.ADMIN.USUARIOS.LIST}?pagina=${pagina}&limite=${porPagina}`;
      const response = await fetch(url);
      
      // Si la API no está disponible, usamos Supabase directamente como fallback
      if (!response.ok) {
        console.warn('API no disponible, utilizando conexión directa a Supabase');
        // Importación dinámica para evitar cargar Supabase innecesariamente si la API está disponible
        const { default: supabase } = await import('@/lib/supabaseClient');
        
        const desde = (pagina - 1) * porPagina;
        const hasta = desde + porPagina - 1;
        
        const { data, error } = await supabase
          .from('usuarios')
          .select('id, nombre, email, foto_perfil, role, created_at, telefono')
          .order('created_at', { ascending: false })
          .range(desde, hasta);
          
        if (error) throw error;
        return data || [];
      }
      
      const data = await response.json();
      return data.usuarios || [];
    } catch (error) {
      console.error('Error al obtener listado de usuarios:', error);
      return [];
    }
  }
};

export default adminModel; 