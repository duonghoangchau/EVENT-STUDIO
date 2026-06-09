import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { PreferencesProvider, PreferenceViewport } from '@/components/preferences-provider';
import { getServerPreferences } from '@/lib/preferences-server';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

export const metadata: Metadata = {
  title: 'Delfi Event Studio',
  description: 'Internal event landing page and form builder',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const preferences = await getServerPreferences();

  return (
    <html lang={preferences.language} data-theme={preferences.theme}>
      <body className={inter.className}>
        <PreferencesProvider initialLanguage={preferences.language} initialTheme={preferences.theme}>
          <PreferenceViewport />
          {children}
        </PreferencesProvider>
      </body>
    </html>
  );
}
