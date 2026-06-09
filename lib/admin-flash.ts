import { cookies } from 'next/headers';
import { getPreferenceLanguage, PreferenceLanguage } from '@/lib/preferences';

const ADMIN_FLASH_COOKIE = 'delfi_admin_flash';

export type AdminFlash = {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
};

export async function getAdminFlashLanguage(): Promise<PreferenceLanguage> {
  const store = await cookies();
  return getPreferenceLanguage(store.get('delfi_language')?.value, 'vi');
}

export async function setAdminFlash(flash: Omit<AdminFlash, 'id'>) {
  const store = await cookies();
  const payload: AdminFlash = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ...flash,
  };

  store.set(ADMIN_FLASH_COOKIE, JSON.stringify(payload), {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 60 * 5,
  });
}

export async function readAdminFlash() {
  const store = await cookies();
  const raw = store.get(ADMIN_FLASH_COOKIE)?.value;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AdminFlash;
    if (!parsed?.id || !parsed?.type || !parsed?.title) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function clearAdminFlash() {
  const store = await cookies();
  store.delete(ADMIN_FLASH_COOKIE);
}
