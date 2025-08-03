// app/pomodoro-timer/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pomodoro Timer | Online Utility',
  description: 'A simple and effective Pomodoro Timer to help you stay focused and productive. Customize work and break durations.',
  openGraph: {
    title: 'Pomodoro Timer | Online Utility',
    description: 'A simple and effective Pomodoro Timer to help you stay focused and productive. Customize work and break durations.',
    url: 'https://utility.crimsondevil.qzz.io/pomodoro-timer',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Pomodoro Timer | Online Utility',
    description: 'A simple and effective Pomodoro Timer to help you stay focused and productive. Customize work and break durations.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
