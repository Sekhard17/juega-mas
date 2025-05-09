import { SignJWT, jwtVerify } from 'jose';
import { User } from '@/types/user';

// Obtener la clave secreta desde las variables de entorno
const JWT_SECRET = process.env.JWT_SECRET || 'YQnrWiVejJGtuIcBvNq6XzfE97kD52pTZ8mSbH4s3AUxOlwyaL';
// Convertir a Uint8Array para jose
const JWT_SECRET_BYTES = new TextEncoder().encode(JWT_SECRET);
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

// Tipos
// Modificando para que sea compatible con JWTPayload de jose, añadiendo signatura de índice
export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
  [key: string]: any; // Añadido signatura de índice para cumplir con JWTPayload
}

/**
 * Genera un token JWT para un usuario
 */
export const generateToken = async (user: User): Promise<string> => {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  // Calcular la expiración en segundos
  const expiryDays = JWT_EXPIRY.replace('d', '');
  const expirySeconds = parseInt(expiryDays) * 24 * 60 * 60;

  // Crear y firmar el token con jose
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expirySeconds)
    .sign(JWT_SECRET_BYTES);
};

/**
 * Verifica y decodifica un token JWT
 */
export const verifyToken = async (token: string): Promise<JwtPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_BYTES);
    return payload as unknown as JwtPayload;
  } catch (error) {
    console.error('Error al verificar token JWT:', error);
    return null;
  }
};

/**
 * Extrae el token de la cookie
 */
export const getTokenFromCookies = (cookies: { [key: string]: string }): string | null => {
  return cookies.authToken || null;
}; 