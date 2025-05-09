import supabase from '@/lib/supabaseClient';
import bcrypt from 'bcryptjs';
import { User, RegisterUser, LoginCredentials } from '@/types/user';

export const authModel = {
  /**
   * Registrar un nuevo usuario
   */
  async register(userData: RegisterUser): Promise<User | null> {
    try {
      // Encriptar contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Insertar usuario en la base de datos
      const { data, error } = await supabase
        .from('usuarios')
        .insert({
          email: userData.email,
          nombre: userData.nombre,
          telefono: userData.telefono || null,
          role: userData.role || 'usuario',
          password_hash: hashedPassword
        })
        .select('id, email, nombre, telefono, foto_perfil, role, created_at, updated_at')
        .single();
      
      if (error) throw error;
      
      return data as User;
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      return null;
    }
  },

  /**
   * Iniciar sesión de usuario
   */
  async login(credentials: LoginCredentials): Promise<User | null> {
    try {
      // Buscar usuario por email
      const { data: user, error } = await supabase
        .from('usuarios')
        .select('id, email, nombre, telefono, foto_perfil, role, password_hash, created_at, updated_at')
        .eq('email', credentials.email)
        .single();
      
      if (error || !user) return null;
      
      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(
        credentials.password, 
        user.password_hash
      );
      
      if (!isValidPassword) return null;
      
      // Eliminar password_hash del objeto de usuario antes de devolverlo
      const { password_hash, ...userWithoutPassword } = user;
      
      return userWithoutPassword as User;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return null;
    }
  },

  /**
   * Obtener usuario por ID
   */
  async getUserById(userId: number): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, email, nombre, telefono, foto_perfil, role, created_at, updated_at')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      return data as User;
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      return null;
    }
  },

  /**
   * Obtener usuario por email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, email, nombre, telefono, foto_perfil, role, created_at, updated_at')
        .eq('email', email)
        .single();
      
      if (error) throw error;
      
      return data as User;
    } catch (error) {
      console.error('Error al obtener usuario por email:', error);
      return null;
    }
  }
}; 