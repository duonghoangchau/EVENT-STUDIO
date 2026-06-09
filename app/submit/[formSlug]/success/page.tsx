import Link from 'next/link';
import { getServerPreferences } from '@/lib/preferences-server';
import { t } from '@/lib/preferences';

export default async function SuccessPage() {
  const preferences = await getServerPreferences();

  return (
    <div className="flex min-h-screen items-center justify-center app-surface-alt p-5">
      <div className="max-w-xl rounded-3xl app-surface p-10 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">✓</div>
        <h1 className="text-3xl font-black app-strong">{t(preferences.language, 'registrationSuccess')}</h1>
        <p className="mt-3 app-muted">{t(preferences.language, 'registrationSaved')}</p>
        <Link href="/" className="btn-primary mt-6">
          {t(preferences.language, 'backToHome')}
        </Link>
      </div>
    </div>
  );
}
