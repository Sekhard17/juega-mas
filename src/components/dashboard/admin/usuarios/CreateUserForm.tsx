import { useState } from 'react';
import { toast } from 'sonner';
import { NuevoUsuario } from '@/models/adminModel';

interface CreateUserFormProps {
  onSubmit: (usuario: NuevoUsuario) => Promise<void>;
  onCancel: () => void;
}

export function CreateUserForm({ onSubmit, onCancel }: CreateUserFormProps) {
  const [formData, setFormData] = useState<NuevoUsuario>({
    nombre: '',
    email: '',
    password: '',
    role: 'cliente',
    telefono: ''
  });
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validar contraseñas cuando se modifica alguna
    if (name === 'password' && confirmPassword) {
      validatePasswords(value, confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    validatePasswords(formData.password, value);
  };

  const validatePasswords = (password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
      // Reset form data after successful submission
      setFormData({
        nombre: '',
        email: '',
        password: '',
        role: 'cliente',
        telefono: ''
      });
      setConfirmPassword('');
    } catch (error) {
      console.error('Error al crear usuario:', error);
      toast.error('Error al crear el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4" id="modal-title">
        Crear Nuevo Usuario
      </h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nombre Completo
          </label>
          <input
            type="text"
            name="nombre"
            id="nombre"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Rol
          </label>
          <select
            name="role"
            id="role"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="cliente">Cliente</option>
            <option value="propietario">Propietario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Teléfono
          </label>
          <input
            type="tel"
            name="telefono"
            id="telefono"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.telefono}
            onChange={handleChange}
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Opcional</p>
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              passwordError ? 'border-red-300' : 'border-gray-300'
            }`}
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Mínimo 8 caracteres</p>
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirmar Contraseña
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              passwordError ? 'border-red-300' : 'border-gray-300'
            }`}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
          {passwordError && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{passwordError}</p>
          )}
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || !!passwordError}
        >
          {loading ? 'Creando...' : 'Crear Usuario'}
        </button>
      </div>
    </form>
  );
} 