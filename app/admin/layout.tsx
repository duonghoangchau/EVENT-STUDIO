import { AppShell } from '@/components/app-shell';
import { requireAdmin } from '@/lib/auth';
import { getServerPreferences } from '@/lib/preferences-server';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  const preferences = await getServerPreferences();

  return <AppShell user={user} language={preferences.language}>{children}</AppShell>;
}
