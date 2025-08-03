// app/bmi-calculator/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BMI Calculator | Online Utility',
  description: 'Calculate your Body Mass Index (BMI) using metric or imperial units. Get a quick assessment of your weight status.',
  openGraph: {
    title: 'BMI Calculator | Online Utility',
    description: 'Calculate your Body Mass Index (BMI) using metric or imperial units. Get a quick assessment of your weight status.',
    url: 'https://utility.crimsondevil.qzz.io/bmi-calculator',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'BMI Calculator | Online Utility',
    description: 'Calculate your Body Mass Index (BMI) using metric or imperial units. Get a quick assessment of your weight status.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
