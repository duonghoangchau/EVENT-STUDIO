import Link from 'next/link';
import { Sparkles, LayoutDashboard, FolderKanban, Images, Settings } from 'lucide-react';
import { User } from '@prisma/client';
import { signOutAdmin } from '@/app/actions';

const nav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/templates', label: 'Templates', icon: Sparkles },
  { href: '/admin/assets', label: 'Assets', icon: Images },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AppShell({ children, user }: { children: React.ReactNode; user: Pick<User, 'name' | 'email'> }) {
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white p-5 lg:block">
        <Link href="/admin" className="flex items-center gap-3 rounded-2xl bg-slate-950 p-4 text-white">
          <div className="rounded-xl bg-white/10 p-2"><Sparkles size={22} /></div>
          <div>
            <div className="font-bold">Delfi Event Studio</div>
            <div className="text-xs text-slate-300">AI + Template Builder</div>
          </div>
        </Link>
        <nav className="mt-8 space-y-2">
          {nav.map((item) => {
            const Icon = item.icon;
            return <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-950"><Icon size={18}/>{item.label}</Link>;
          })}
        </nav>
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm font-bold text-slate-900">{user.name}</div>
          <div className="mt-1 text-xs text-slate-500">{user.email}</div>
          <form action={signOutAdmin} className="mt-4">
            <button className="btn-secondary w-full" type="submit">Sign out</button>
          </form>
        </div>
      </aside>
      <main className="lg:pl-72">
        <div className="mx-auto max-w-7xl p-5 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
