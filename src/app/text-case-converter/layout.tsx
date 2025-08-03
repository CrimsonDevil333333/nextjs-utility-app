// app/text-case-converter/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Text Case Converter | Online Utility',
  description: 'Convert text between different case formats instantly: Sentence case, lowercase, UPPERCASE, Title Case, camelCase, PascalCase, kebab-case, and snake_case.',
  openGraph: {
    title: 'Text Case Converter | Online Utility',
    description: 'Convert text between different case formats instantly: Sentence case, lowercase, UPPERCASE, Title Case, camelCase, PascalCase, kebab-case, and snake_case.',
    url: 'https://utility.crimsondevil.qzz.io/text-case-converter',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Text Case Converter | Online Utility',
    description: 'Convert text between different case formats instantly: Sentence case, lowercase, UPPERCASE, Title Case, camelCase, PascalCase, kebab-case, and snake_case.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
