// Tipos de vistas disponibles
export type ViewMode = 'cards' | 'table';

const VIEW_MODE_KEY = 'juegamas_view_mode';

/**
 * Guarda el modo de vista preferido en localStorage
 */
export const saveViewMode = (mode: ViewMode): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(VIEW_MODE_KEY, mode);
    }
  } catch (error) {
    console.error('Error al guardar preferencia de vista:', error);
  }
};

/**
 * Obtiene el modo de vista guardado en localStorage
 * Por defecto devuelve 'cards' si no hay preferencia guardada
 */
export const getViewMode = (): ViewMode => {
  try {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem(VIEW_MODE_KEY);
      if (savedMode === 'cards' || savedMode === 'table') {
        return savedMode;
      }
    }
    return 'cards'; // valor por defecto
  } catch (error) {
    console.error('Error al obtener preferencia de vista:', error);
    return 'cards'; // valor por defecto en caso de error
  }
}; 