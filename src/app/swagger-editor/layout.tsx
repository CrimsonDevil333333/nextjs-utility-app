'use client';

import { ReactNode } from 'react';
import { Metadata } from 'next';

// --- ADDED: Metadata for SEO and social sharing ---
export const metadata: Metadata = {
  title: 'Swagger/OpenAPI Editor | Online Utility',
  description: 'Visually edit and test OpenAPI (Swagger) specifications in YAML or JSON format with a real-time preview.',
  openGraph: {
    title: 'Swagger/OpenAPI Editor | Online Utility',
    description: 'Visually edit and test OpenAPI (Swagger) specifications in YAML or JSON format with a real-time preview.',
    url: 'https://utility.crimsondevil.qzz.io/swagger-editor', // Note: Update this URL to your actual domain
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Swagger/OpenAPI Editor | Online Utility',
    description: 'Visually edit and test OpenAPI (Swagger) specifications in YAML or JSON format with a real-time preview.',
  },
};

export default function SwaggerEditorLayout({ children }: { children: ReactNode }) {
  return <div className="h-screen w-screen bg-gray-100 dark:bg-gray-900">{children}</div>;
}