import { authModel } from '@/models/authModel';
import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabaseClient';
import { AdminEstadisticas, Usuario } from '@/models/adminModel';

interface RoleCount {
  role: string;
  count: string;
}

export class AdminController {
  /**
   * Obtener estadísticas para el dashboard de administrador
   */
  static async obtenerEstadisticas(): Promise<AdminEstadisticas> {
    try {
      // Consultas por rol individual (Supabase Client no soporta group by en JS)
      const { count: totalUsuarios, error: errorUsuarios } = await supabase
        .from('usuarios')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'usuario');
      
      const { count: totalPropietarios, error: errorPropietarios } = await supabase
        .from('usuarios')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'propietario');
      
      const { count: totalAdmins, error: errorAdmins } = await supabase
        .from('usuarios')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin');
      
      if (errorUsuarios || errorPropietarios || errorAdmins) {
        throw new Error('Error al obtener conteos de usuarios');
      }
      
      // Obtener conteo de recintos
      const { count: totalRecintos, error: errorRecintos } = await supabase
        .from('recintos')
        .select('id', { count: 'exact', head: true });
      
      if (errorRecintos) throw errorRecintos;
      
      // Obtener suscripciones activas
      const { count: suscripcionesActivas, error: errorSuscripciones } = await supabase
        .from('suscripciones')
        .select('id', { count: 'exact', head: true })
        .eq('estado', 'activa');
      
      if (errorSuscripciones) throw errorSuscripciones;
      
      return {
        totalClientes: totalUsuarios || 0,
        totalPropietarios: totalPropietarios || 0,
        totalRecintos: totalRecintos || 0,
        suscripcionesActivas: suscripcionesActivas || 0,
        tendencias: {
          clientes: { valor: 0, esPositiva: true },
          propietarios: { valor: 0, esPositiva: true },
          recintos: { valor: 0, esPositiva: true },
          suscripciones: { valor: 0, esPositiva: true }
        }
      };
    } catch (error) {
      console.error('Error al obtener estadísticas admin:', error);
      // Datos vacíos en caso de error
      return {
        totalClientes: 0,
        totalPropietarios: 0,
        totalRecintos: 0,
        suscripcionesActivas: 0
      };
    }
  }

  /**
   * Obtener lista de usuarios recientes
   */
  static async obtenerUsuariosRecientes(limite: number = 5): Promise<Usuario[]> {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, nombre, email, foto_perfil, role, created_at, telefono')
        .order('created_at', { ascending: false })
        .limit(limite);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error al obtener usuarios recientes:', error);
      return [];
    }
  }

  /**
   * Obtener lista paginada de usuarios
   */
  static async obtenerUsuarios(pagina: number = 1, porPagina: number = 10): Promise<Usuario[]> {
    try {
      const desde = (pagina - 1) * porPagina;
      const hasta = desde + porPagina - 1;
      
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, nombre, email, foto_perfil, role, created_at, telefono')
        .order('created_at', { ascending: false })
        .range(desde, hasta);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error al obtener usuarios paginados:', error);
      return [];
    }
  }

  /**
   * Actualizar rol de usuario
   */
  static async actualizarRolUsuario(userId: number, nuevoRol: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ role: nuevoRol })
        .eq('id', userId);
      
      return !error;
    } catch (error) {
      console.error('Error al actualizar rol de usuario:', error);
      return false;
    }
  }
} 