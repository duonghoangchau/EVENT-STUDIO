import { signInAdmin } from '@/app/actions';
import { getCurrentAdmin } from '@/lib/auth';
import { getServerPreferences } from '@/lib/preferences-server';
import { t } from '@/lib/preferences';
import { redirect } from 'next/navigation';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await getCurrentAdmin();
  if (user) redirect('/admin');

  const preferences = await getServerPreferences();
  const { error } = await searchParams;
  const errorMessages: Record<string, string> = {
    invalid_credentials: t(preferences.language, 'invalidCredentials'),
    missing_credentials: t(preferences.language, 'missingCredentials'),
  };
  const message = error ? errorMessages[error] || t(preferences.language, 'loginFailed') : '';

  return (
    <div className="flex min-h-screen items-center justify-center app-surface-alt p-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border app-border app-surface shadow-xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-slate-950 p-10 text-white">
          <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-blue-200">{t(preferences.language, 'adminAccess')}</div>
          <h1 className="mt-6 max-w-md text-4xl font-black leading-tight">
            {preferences.language === 'vi'
              ? 'Quan ly landing page, template va form dang ky trong mot khu admin rieng.'
              : 'Manage landing pages, templates, and registration forms inside a protected admin workspace.'}
          </h1>
          <p className="mt-4 max-w-xl text-slate-300">
            {preferences.language === 'vi'
              ? 'Route public chi hien thi landing page va form dang ky. Moi tac vu tao project, builder, template va submissions deu duoc bao ve bang phien dang nhap admin.'
              : 'Public routes only render the landing page and registration form. Project creation, builders, templates, and submissions stay protected behind an admin session.'}
          </p>
          <div className="mt-8 grid gap-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Public site: <code>/{'{project-slug}'}</code></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Public registration: <code>/{'{project-slug}'}/register</code></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Admin workspace: <code>/admin</code></div>
          </div>
        </div>

        <div className="p-8 lg:p-10">
          <div className="mx-auto max-w-md">
            <h2 className="text-3xl font-black app-strong">{t(preferences.language, 'loginTitle')}</h2>
            <p className="mt-2 text-sm app-muted">{t(preferences.language, 'loginSubtitle')}</p>

            <form action={signInAdmin} className="mt-8 space-y-5">
              <div>
                <label className="label">{t(preferences.language, 'email')}</label>
                <input name="email" type="email" className="input mt-2" placeholder="admin@delfi.vn" required />
              </div>
              <div>
                <label className="label">{t(preferences.language, 'password')}</label>
                <input
                  name="password"
                  type="password"
                  className="input mt-2"
                  placeholder={preferences.language === 'vi' ? 'Nhap mat khau admin' : 'Enter admin password'}
                  required
                />
              </div>

              {message ? <div className="rounded-2xl border app-danger px-4 py-3 text-sm font-medium">{message}</div> : null}

              <button className="btn-primary w-full" type="submit">
                {t(preferences.language, 'loginButton')}
              </button>
            </form>

            <p className="mt-6 text-sm app-muted">{t(preferences.language, 'publicVisitorsHint')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
