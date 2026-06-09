import { AdminFlashToast } from '@/components/admin-flash-toast';
import { AppShell } from '@/components/app-shell';
import { readAdminFlash } from '@/lib/admin-flash';
import { requireAdmin } from '@/lib/auth';
import { getServerPreferences } from '@/lib/preferences-server';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  const preferences = await getServerPreferences();
  const flash = await readAdminFlash();

  return (
    <AppShell user={user} language={preferences.language}>
      <AdminFlashToast initialFlash={flash} />
      {children}
    </AppShell>
  );
}
