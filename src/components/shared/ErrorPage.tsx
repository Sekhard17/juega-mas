'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface ErrorPageProps {
  title: string;
  message: string;
  code: string | number;
  primaryActionText?: string;
  primaryActionHref?: string;
  secondaryActionText?: string;
  secondaryActionHref?: string;
  icon?: ReactNode;
}

export default function ErrorPage({
  title,
  message,
  code,
  primaryActionText = 'Volver al inicio',
  primaryActionHref = '/',
  secondaryActionText,
  secondaryActionHref,
  icon
}: ErrorPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-background-light dark:bg-background-dark">
      <div className="text-center max-w-md mx-auto">
        {icon && (
          <div className="mb-6 text-primary-500">
            {icon}
          </div>
        )}
        
        <h1 className="text-8xl font-bold text-primary-500">{code}</h1>
        <div className="my-6 h-1 w-16 bg-primary-400 mx-auto rounded-full"></div>
        <h2 className="text-3xl font-bold mb-4 text-text-light dark:text-text-dark">
          {title}
        </h2>
        <p className="text-lg mb-8 text-gray-600 dark:text-gray-400">
          {message}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={primaryActionHref}
            className="px-6 py-3 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            {primaryActionText}
          </Link>
          
          {secondaryActionText && secondaryActionHref && (
            <Link
              href={secondaryActionHref}
              className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              {secondaryActionText}
            </Link>
          )}
        </div>
      </div>
      
      {/* Elementos decorativos */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-200/30 dark:bg-primary-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary-300/30 dark:bg-primary-800/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-primary-400/30 dark:bg-primary-700/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>
  );
} 