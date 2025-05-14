// API base URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// API Endpoints
export const API_ROUTES = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    VERIFY_TOKEN: `${API_BASE_URL}/auth/verify`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  },
  USER: {
    PROFILE: `${API_BASE_URL}/user/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/user/profile`,
    UPDATE_PHOTO: `${API_BASE_URL}/user/profile/photo`,
    CHANGE_PASSWORD: `${API_BASE_URL}/user/profile/password`,
  },
  ESPACIOS: {
    LIST: `${API_BASE_URL}/espacios`,
    DETAIL: (id: number) => `${API_BASE_URL}/espacios/${id}`,
    CREATE: `${API_BASE_URL}/espacios`,
    UPDATE: (id: number) => `${API_BASE_URL}/espacios/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/espacios/${id}`,
    ESTADISTICAS: (id: number) => `${API_BASE_URL}/espacios/${id}/estadisticas`,
    OCUPACION: (id: number) => `${API_BASE_URL}/espacios/${id}/ocupacion`,
    TENDENCIAS: (id: number) => `${API_BASE_URL}/espacios/${id}/tendencias`,
  },
  RESERVAS: {
    LIST: `${API_BASE_URL}/reservas`,
    DETAIL: (id: number) => `${API_BASE_URL}/reservas/${id}`,
    CREATE: `${API_BASE_URL}/reservas`,
    CANCEL: (id: number) => `${API_BASE_URL}/reservas/${id}/cancel`,
  },
  CONTACTO: {
    ENVIAR: `${API_BASE_URL}/contacto`,
    MENSAJES: `${API_BASE_URL}/contacto/mensajes`,
    LEER: (id: number) => `${API_BASE_URL}/contacto/${id}/leer`,
    RESPONDER: (id: number) => `${API_BASE_URL}/contacto/${id}/responder`
  },
  PROPIETARIO: {
    DASHBOARD: `${API_BASE_URL}/propietario/dashboard`,
    RESUMEN: `${API_BASE_URL}/propietario/resumen`,
    ESPACIOS: `${API_BASE_URL}/propietario/espacios`,
    RESERVAS: `${API_BASE_URL}/propietario/reservas`,
    RESEÑAS: `${API_BASE_URL}/propietario/reseñas`,
    INGRESOS: `${API_BASE_URL}/propietario/ingresos`
  },
  ADMIN: {
    ESTADISTICAS: `${API_BASE_URL}/admin/estadisticas`,
    USUARIOS: {
      LIST: `${API_BASE_URL}/admin/usuarios`,
      RECIENTES: `${API_BASE_URL}/admin/usuarios/recientes`,
      DETAIL: (id: number) => `${API_BASE_URL}/admin/usuarios/${id}`,
      UPDATE: (id: number) => `${API_BASE_URL}/admin/usuarios/${id}`,
      DELETE: (id: number) => `${API_BASE_URL}/admin/usuarios/${id}`,
      CAMBIAR_ROL: (id: number) => `${API_BASE_URL}/admin/usuarios/${id}/rol`
    },
    RECINTOS: `${API_BASE_URL}/admin/recintos`,
    REPORTES: `${API_BASE_URL}/admin/reportes`
  }
}; 