'use client';

import { Toaster } from 'sonner';
import { useTheme } from '@/components/shared/ThemeProvider';

export default function ToastProvider() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Definimos las opciones fuera para evitar problemas de tipado
  const toastOptions = {
    style: {
      background: isDark ? '#1f2937' : '#ffffff',
      color: isDark ? '#f3f4f6' : '#111827',
      border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      fontWeight: '500',
    },
    className: 'toast-item',
    duration: 4000,
    // Estilos personalizados para cada tipo de toast
    success: {
      style: {
        background: isDark ? '#064e3b' : '#ecfdf5',
        border: isDark ? '1px solid #047857' : '1px solid #a7f3d0',
        color: isDark ? '#d1fae5' : '#065f46',
      },
      icon: '✅',
    },
    error: {
      style: {
        background: isDark ? '#7f1d1d' : '#fef2f2',
        border: isDark ? '1px solid #b91c1c' : '1px solid #fecaca',
        color: isDark ? '#fee2e2' : '#b91c1c',
      },
      icon: '❌',
    },
    warning: {
      style: {
        background: isDark ? '#78350f' : '#fffbeb',
        border: isDark ? '1px solid #92400e' : '1px solid #fef3c7',
        color: isDark ? '#fef3c7' : '#92400e',
      },
      icon: '⚠️',
    },
    info: {
      style: {
        background: isDark ? '#1e3a8a' : '#eff6ff',
        border: isDark ? '1px solid #1d4ed8' : '1px solid #bfdbfe',
        color: isDark ? '#bfdbfe' : '#1d4ed8',
      },
      icon: 'ℹ️',
    },
  };

  return (
    <Toaster
      position="bottom-right"
      // @ts-ignore - La librería sonner en la versión 2.0.3 tiene tipado limitado
      toastOptions={toastOptions}
      theme={isDark ? 'dark' : 'light'}
      richColors={false}
      expand={false}
      visibleToasts={3}
      closeButton
      offset="1.5rem"
    />
  );
} 