export type UserRole = 'usuario' | 'propietario' | 'admin' | 'cliente';

export interface User {
  id: number;
  email: string;
  nombre: string;
  telefono?: string;
  foto_perfil?: string;
  biografia?: string;
  notificaciones_email?: boolean;
  notificaciones_app?: boolean;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

export interface RegisterUser {
  email: string;
  password: string;
  nombre: string;
  telefono?: string;
  role?: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface PasswordReset {
  email: string;
  newPassword: string;
  resetToken: string;
} 