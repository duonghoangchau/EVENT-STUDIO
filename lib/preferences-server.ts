import { cookies } from 'next/headers';
import { DEFAULT_LANGUAGE, DEFAULT_THEME, getPreferenceLanguage, getPreferenceTheme, PreferenceLanguage, PreferenceTheme, PREFERENCE_COOKIE_KEYS } from '@/lib/preferences';

export async function getServerPreferences(options?: { defaultLanguage?: PreferenceLanguage; defaultTheme?: PreferenceTheme }) {
  const store = await cookies();

  return {
    language: getPreferenceLanguage(store.get(PREFERENCE_COOKIE_KEYS.language)?.value, options?.defaultLanguage || DEFAULT_LANGUAGE),
    theme: getPreferenceTheme(store.get(PREFERENCE_COOKIE_KEYS.theme)?.value, options?.defaultTheme || DEFAULT_THEME),
  };
}
