'use client';

import { Globe, Monitor, Moon, Settings2, Sun, X } from 'lucide-react';
import { createContext, startTransition, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  DEFAULT_LANGUAGE,
  DEFAULT_THEME,
  getPreferenceLanguage,
  getPreferenceTheme,
  PreferenceLanguage,
  PreferenceTheme,
  PREFERENCE_COOKIE_KEYS,
  t,
} from '@/lib/preferences';

type PreferencesContextValue = {
  language: PreferenceLanguage;
  theme: PreferenceTheme;
  setLanguage: (language: PreferenceLanguage) => void;
  setTheme: (theme: PreferenceTheme) => void;
  translate: (key: Parameters<typeof t>[1]) => string;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function persistPreferences(language: PreferenceLanguage, theme: PreferenceTheme) {
  document.documentElement.lang = language;
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(PREFERENCE_COOKIE_KEYS.language, language);
  localStorage.setItem(PREFERENCE_COOKIE_KEYS.theme, theme);
  document.cookie = `${PREFERENCE_COOKIE_KEYS.language}=${language}; path=/; max-age=31536000; samesite=lax`;
  document.cookie = `${PREFERENCE_COOKIE_KEYS.theme}=${theme}; path=/; max-age=31536000; samesite=lax`;
}

export function PreferencesProvider({
  children,
  initialLanguage = DEFAULT_LANGUAGE,
  initialTheme = DEFAULT_THEME,
}: {
  children: React.ReactNode;
  initialLanguage?: PreferenceLanguage;
  initialTheme?: PreferenceTheme;
}) {
  const router = useRouter();
  const [language, setLanguageState] = useState<PreferenceLanguage>(initialLanguage);
  const [theme, setThemeState] = useState<PreferenceTheme>(initialTheme);
  const hydratedRef = useRef(false);

  useEffect(() => {
    const storedLanguage = getPreferenceLanguage(localStorage.getItem(PREFERENCE_COOKIE_KEYS.language), initialLanguage);
    const storedTheme = getPreferenceTheme(localStorage.getItem(PREFERENCE_COOKIE_KEYS.theme), initialTheme);
    const needsRefresh = storedLanguage !== initialLanguage || storedTheme !== initialTheme;

    setLanguageState(storedLanguage);
    setThemeState(storedTheme);
    persistPreferences(storedLanguage, storedTheme);
    hydratedRef.current = true;

    if (needsRefresh) {
      startTransition(() => router.refresh());
    }
  }, [initialLanguage, initialTheme, router]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    persistPreferences(language, theme);
  }, [language, theme]);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      language,
      theme,
      setLanguage: (nextLanguage) => {
        setLanguageState(nextLanguage);
        persistPreferences(nextLanguage, theme);
        startTransition(() => router.refresh());
      },
      setTheme: (nextTheme) => {
        setThemeState(nextTheme);
        persistPreferences(language, nextTheme);
        startTransition(() => router.refresh());
      },
      translate: (key) => t(language, key),
    }),
    [language, router, theme]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences must be used within PreferencesProvider');
  return context;
}

function PreferenceSection({
  icon,
  label,
  options,
}: {
  icon: React.ReactNode;
  label: string;
  options: Array<{ active: boolean; label: string; onClick: () => void }>;
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] app-muted">
        {icon}
        <span>{label}</span>
      </div>
      <div className="preference-group">
        {options.map((option) => (
          <button key={option.label} className={`preference-option ${option.active ? 'is-active' : ''}`} type="button" onClick={option.onClick}>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PreferenceSettingsPanel() {
  const { language, setLanguage, setTheme, theme, translate } = usePreferences();

  return (
    <div className="section-shell p-6">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl app-soft p-3 app-strong">
          <Settings2 size={18} />
        </div>
        <div>
          <h2 className="text-xl font-black app-strong">{translate('settings')}</h2>
          <p className="mt-1 text-sm app-muted">
            {language === 'vi'
              ? 'Dieu chinh ngon ngu va che do sang/toi cho khu vuc quan tri. Lua chon duoc luu lai va ap dung ngay.'
              : 'Adjust language and light/dark mode for the admin workspace. Your choice is saved and applied immediately.'}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <PreferenceSection
          icon={<Globe size={14} />}
          label={translate('language')}
          options={[
            { active: language === 'vi', label: translate('vietnamese'), onClick: () => setLanguage('vi') },
            { active: language === 'en', label: translate('english'), onClick: () => setLanguage('en') },
          ]}
        />
        <PreferenceSection
          icon={<Monitor size={14} />}
          label={translate('theme')}
          options={[
            { active: theme === 'light', label: translate('lightMode'), onClick: () => setTheme('light') },
            { active: theme === 'dark', label: translate('darkMode'), onClick: () => setTheme('dark') },
          ]}
        />
      </div>
    </div>
  );
}

export function PublicPreferenceLauncher() {
  const { language, setLanguage, setTheme, theme, translate } = usePreferences();
  const [open, setOpen] = useState(false);

  return (
    <div className="public-preference-shell fixed bottom-4 right-4 z-50 md:top-4 md:right-4 md:bottom-auto">
      {open ? (
        <div className="public-preference-popover w-[min(86vw,18rem)] rounded-2xl border p-3 shadow-xl">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-xs font-bold uppercase tracking-[0.16em] app-muted">
              {language === 'vi' ? 'TÙY CHỌN HIỂN THỊ' : 'Display options'}
            </div>
            <button className="public-preference-close" type="button" onClick={() => setOpen(false)} aria-label="Close display preferences">
              <X size={15} />
            </button>
          </div>

          <div className="space-y-3">
            <PreferenceSection
              icon={<Globe size={14} />}
              label={translate('language')}
              options={[
                { active: language === 'vi', label: 'VI', onClick: () => setLanguage('vi') },
                { active: language === 'en', label: 'EN', onClick: () => setLanguage('en') },
              ]}
            />
            <PreferenceSection
              icon={theme === 'light' ? <Sun size={14} /> : <Moon size={14} />}
              label={translate('theme')}
              options={[
                { active: theme === 'light', label: translate('lightMode'), onClick: () => setTheme('light') },
                { active: theme === 'dark', label: translate('darkMode'), onClick: () => setTheme('dark') },
              ]}
            />
          </div>
        </div>
      ) : null}

      <button className="public-preference-trigger" type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open}>
        <span className="public-preference-trigger-icon">
          <Settings2 size={16} />
        </span>
        <span className="hidden sm:inline">{language.toUpperCase()}</span>
        <span className="public-preference-divider hidden sm:block" />
        <span className="hidden sm:flex items-center gap-1.5">
          {theme === 'light' ? <Sun size={14} /> : <Moon size={14} />}
          {theme === 'light' ? translate('lightMode') : translate('darkMode')}
        </span>
      </button>
    </div>
  );
}

export function PreferenceViewport() {
  const pathname = usePathname();

  if (!pathname) return null;
  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) return null;

  return <PublicPreferenceLauncher />;
}
