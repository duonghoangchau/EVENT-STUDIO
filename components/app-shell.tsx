import Link from 'next/link';
import { Sparkles, LayoutDashboard, FolderKanban, Images, Settings } from 'lucide-react';
import { User } from '@prisma/client';
import { signOutAdmin } from '@/app/actions';
import { PreferenceLanguage, t } from '@/lib/preferences';

const nav = [
  { href: '/admin', key: 'dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', key: 'projects', icon: FolderKanban },
  { href: '/admin/templates', key: 'templates', icon: Sparkles },
  { href: '/admin/assets', key: 'assets', icon: Images },
  { href: '/admin/settings', key: 'settings', icon: Settings },
] as const;

export function AppShell({
  children,
  user,
  language,
}: {
  children: React.ReactNode;
  user: Pick<User, 'name' | 'email'>;
  language: PreferenceLanguage;
}) {
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r app-border app-surface p-5 lg:block">
        <Link href="/admin" className="flex items-center gap-3 rounded-2xl app-inverse p-4">
          <div className="rounded-xl bg-white/10 p-2"><Sparkles size={22} /></div>
          <div>
            <div className="font-bold">Delfi Event Studio</div>
            <div className="text-xs text-slate-300">{language === 'vi' ? 'Event + template' : 'Event + Template Builder'}</div>
          </div>
        </Link>
        <nav className="mt-8 space-y-2">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="app-nav-link flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold">
                <Icon size={18} />
                {t(language, item.key)}
              </Link>
            );
          })}
        </nav>
        <div className="mt-8 rounded-2xl border app-border app-surface-alt p-4">
          <div className="text-sm font-bold app-strong">{user.name}</div>
          <div className="mt-1 text-xs app-muted">{user.email}</div>
          <form action={signOutAdmin} className="mt-4">
            <button className="btn-secondary w-full" type="submit">{t(language, 'signOut')}</button>
          </form>
        </div>
      </aside>
      <main className="lg:pl-72">
        <div className="mx-auto max-w-7xl p-5 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
