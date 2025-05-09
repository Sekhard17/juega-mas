'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/user';
import { API_ROUTES } from '@/lib/apiConfig';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Tipos
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterFormData) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

interface RegisterFormData {
  email: string;
  password: string;
  nombre: string;
  telefono?: string;
}

// Crear contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para utilizar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor de autenticación
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(API_ROUTES.AUTH.VERIFY_TOKEN);
        
        // Verificar el Content-Type para asegurarnos que sea JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.warn('La respuesta de verificación no es JSON válido');
          setUser(null);
          setLoading(false);
          return;
        }
        
        // Intentar parsear el JSON con manejo de errores
        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          console.warn('Error al parsear JSON de verificación', jsonError);
          setUser(null);
          setLoading(false);
          return;
        }
        
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        // Error silencioso en desarrollo, pero registramos en producción
        if (process.env.NODE_ENV === 'production') {
          console.error('Error al verificar autenticación:', error);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Iniciar sesión
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(API_ROUTES.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Verificar si la respuesta es JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('La respuesta del servidor no es JSON válido');
        toast.error('Error al iniciar sesión: formato de respuesta inválido');
        return false;
      }

      // Parsear JSON con manejo de errores
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Error al parsear JSON de respuesta', jsonError);
        toast.error('Error al procesar la respuesta del servidor');
        return false;
      }

      if (!response.ok) {
        toast.error(data.error || 'Error al iniciar sesión');
        return false;
      }

      setUser(data.user);
      toast.success('Inicio de sesión exitoso');
      return true;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      toast.error('Error al conectar con el servidor');
      return false;
    }
  };

  // Registrarse
  const register = async (userData: RegisterFormData): Promise<boolean> => {
    try {
      const response = await fetch(API_ROUTES.AUTH.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      // Verificar si la respuesta es JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('La respuesta del servidor no es JSON válido');
        toast.error('Error al registrarse: formato de respuesta inválido');
        return false;
      }

      // Parsear JSON con manejo de errores
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Error al parsear JSON de respuesta', jsonError);
        toast.error('Error al procesar la respuesta del servidor');
        return false;
      }

      if (!response.ok) {
        toast.error(data.error || 'Error al registrarse');
        return false;
      }

      setUser(data.user);
      toast.success('Registro exitoso');
      return true;
    } catch (error) {
      console.error('Error al registrarse:', error);
      toast.error('Error al conectar con el servidor');
      return false;
    }
  };

  // Cerrar sesión
  const logout = async (): Promise<void> => {
    try {
      await fetch(API_ROUTES.AUTH.LOGOUT, {
        method: 'POST',
      });
      
      setUser(null);
      toast.success('Sesión cerrada correctamente');
      router.push('/main/inicio');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  // Actualizar datos del usuario
  const refreshUser = async (): Promise<void> => {
    if (!user) return;
    
    try {
      const response = await fetch(API_ROUTES.AUTH.VERIFY_TOKEN);
      
      // Verificar si la respuesta es JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('La respuesta de verificación no es JSON válido');
        return;
      }
      
      // Parsear JSON con manejo de errores
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.warn('Error al parsear JSON de verificación', jsonError);
        return;
      }
      
      if (data.authenticated && data.user) {
        setUser(data.user);
      }
    } catch (error) {
      // Error silencioso en desarrollo, registramos en producción
      if (process.env.NODE_ENV === 'production') {
        console.error('Error al actualizar datos del usuario:', error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
        refreshUserData: refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
} 