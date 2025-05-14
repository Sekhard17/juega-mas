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
  estado?: string;
}

export interface NuevoUsuario {
  nombre: string;
  email: string;
  password: string;
  role: string;
  telefono?: string;
}

export interface ActualizarUsuario {
  nombre?: string;
  email?: string;
  role?: string;
  telefono?: string;
  estado?: string;
}

const adminModel = {
  async obtenerEstadisticas(): Promise<AdminEstadisticas> {
    try {
      const response = await fetch(API_ROUTES.ADMIN.ESTADISTICAS);
      if (!response.ok) {
        throw new Error('Error al obtener estadísticas');
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
      
      if (!response.ok) {
        throw new Error('Error al obtener usuarios recientes');
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
      
      if (!response.ok) {
        throw new Error('Error al obtener listado de usuarios');
      }
      
      const data = await response.json();
      return data.usuarios || [];
    } catch (error) {
      console.error('Error al obtener listado de usuarios:', error);
      return [];
    }
  },

  /**
   * Obtener detalles de un usuario por ID
   * @param userId ID del usuario
   */
  async obtenerDetallesUsuario(userId: number): Promise<Usuario | null> {
    try {
      const url = API_ROUTES.ADMIN.USUARIOS.DETAIL(userId);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error al obtener detalles del usuario ${userId}`);
      }
      
      const data = await response.json();
      return data.usuario || null;
    } catch (error) {
      console.error('Error al obtener detalles del usuario:', error);
      return null;
    }
  },

  /**
   * Eliminar un usuario
   * @param userId ID del usuario a eliminar
   */
  async eliminarUsuario(userId: number): Promise<boolean> {
    try {
      const url = API_ROUTES.ADMIN.USUARIOS.DELETE(userId);
      const response = await fetch(url, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Error al eliminar usuario ${userId}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return false;
    }
  },

  /**
   * Crear un nuevo usuario
   * @param nuevoUsuario Datos del nuevo usuario
   */
  async crearUsuario(nuevoUsuario: NuevoUsuario): Promise<Usuario | null> {
    try {
      const response = await fetch(API_ROUTES.ADMIN.USUARIOS.LIST, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoUsuario),
      });
      
      if (!response.ok) {
        throw new Error('Error al crear usuario');
      }
      
      const data = await response.json();
      return data.usuario || null;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      return null;
    }
  },

  /**
   * Actualizar un usuario existente
   * @param userId ID del usuario a actualizar
   * @param datosUsuario Datos a actualizar
   */
  async actualizarUsuario(userId: number, datosUsuario: ActualizarUsuario): Promise<Usuario | null> {
    try {
      const url = API_ROUTES.ADMIN.USUARIOS.UPDATE(userId);
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosUsuario),
      });
      
      if (!response.ok) {
        throw new Error(`Error al actualizar usuario ${userId}`);
      }
      
      const data = await response.json();
      return data.usuario || null;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return null;
    }
  },

  /**
   * Cambiar el estado de un usuario (activar/desactivar)
   * @param userId ID del usuario
   * @param estado Nuevo estado ('activo' o 'inactivo')
   */
  async cambiarEstadoUsuario(userId: number, estado: 'activo' | 'inactivo'): Promise<boolean> {
    try {
      const url = API_ROUTES.ADMIN.USUARIOS.UPDATE(userId);
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado }),
      });
      
      if (!response.ok) {
        throw new Error(`Error al cambiar estado del usuario ${userId}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error al cambiar estado del usuario:', error);
      return false;
    }
  },

  /**
   * Cambiar el rol de un usuario
   * @param userId ID del usuario
   * @param nuevoRol Nuevo rol a asignar
   */
  async cambiarRolUsuario(userId: number, nuevoRol: string): Promise<boolean> {
    try {
      const url = API_ROUTES.ADMIN.USUARIOS.CAMBIAR_ROL(userId);
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: nuevoRol }),
      });
      
      if (!response.ok) {
        throw new Error(`Error al cambiar rol del usuario ${userId}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error al cambiar rol del usuario:', error);
      return false;
    }
  }
};

export default adminModel; 