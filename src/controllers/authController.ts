import { authModel } from '@/models/authModel';
import { generateToken } from '@/lib/jwt';
import { LoginCredentials, RegisterUser, User, AuthResponse } from '@/types/user';
import { setCookie, deleteCookie } from 'cookies-next';
import { NextRequest, NextResponse } from 'next/server';

export class AuthController {
  /**
   * Registrar un nuevo usuario
   */
  static async register(userData: RegisterUser): Promise<AuthResponse | null> {
    try {
      // Comprobar si el usuario ya existe
      const existingUser = await authModel.getUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('El email ya está registrado');
      }

      // Registrar el usuario
      const user = await authModel.register(userData);
      if (!user) {
        throw new Error('Error al registrar el usuario');
      }

      // Generar token
      const token = await generateToken(user);

      return { user, token };
    } catch (error) {
      console.error('Error en el controlador de registro:', error);
      return null;
    }
  }

  /**
   * Iniciar sesión de usuario
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse | null> {
    try {
      // Iniciar sesión
      const user = await authModel.login(credentials);
      if (!user) {
        throw new Error('Email o contraseña incorrectos');
      }

      // Generar token
      const token = await generateToken(user);

      return { user, token };
    } catch (error) {
      console.error('Error en el controlador de login:', error);
      return null;
    }
  }

  /**
   * Verificar token JWT
   */
  static async verifyAuth(req: NextRequest): Promise<User | null> {
    try {
      // Obtener token de las cookies
      const token = req.cookies.get('authToken')?.value;
      
      if (!token) {
        return null;
      }

      // El token se verificará en el middleware
      // Aquí solo necesitamos obtener el usuario del token
      const userId = parseInt(req.headers.get('x-user-id') || '0', 10);
      
      if (!userId) {
        return null;
      }

      // Obtener usuario por ID
      const user = await authModel.getUserById(userId);
      return user;
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      return null;
    }
  }

  /**
   * Establecer cookie de autenticación
   */
  static setAuthCookie(token: string, options: { req?: NextRequest; res?: NextResponse } = {}) {
    setCookie('authToken', token, {
      req: options.req,
      res: options.res,
      maxAge: 7 * 24 * 60 * 60, // 7 días
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }

  /**
   * Eliminar cookie de autenticación
   */
  static clearAuthCookie(options: { req?: NextRequest; res?: NextResponse } = {}) {
    deleteCookie('authToken', {
      req: options.req,
      res: options.res,
      path: '/',
    });
  }
} 