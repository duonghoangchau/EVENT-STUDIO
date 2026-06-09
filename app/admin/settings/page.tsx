import { AdminBreadcrumbs } from '@/components/admin-breadcrumbs';
import { PreferenceSettingsPanel } from '@/components/preferences-provider';
import { getServerPreferences } from '@/lib/preferences-server';
import { t } from '@/lib/preferences';

export default async function SettingsPage() {
  const preferences = await getServerPreferences();

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: t(preferences.language, 'settings') }]} />
      <div className="section-shell p-8">
        <h1 className="text-3xl font-black app-strong">{t(preferences.language, 'settings')}</h1>
        <p className="mt-3 app-muted">
          {preferences.language === 'vi'
            ? 'Nơi này dùng để quản lý các tùy chọn giao diện quản trị và các cấu hình hệ thống ở những phiên bản tiếp theo.'
            : 'Use this area to manage admin display preferences and future system configuration options.'}
        </p>
      </div>

      <PreferenceSettingsPanel />

      <div className="section-shell p-6">
        <h2 className="text-lg font-black app-strong">{preferences.language === 'vi' ? 'Lo trinh tiep theo' : 'Next configuration areas'}</h2>
        <p className="mt-2 app-muted">
          {preferences.language === 'vi'
            ? 'MySQL, storage, publish domain va cac tham so he thong khac co the duoc dua vao day khi can mo rong.'
            : 'MySQL, storage, publish domains, and other system-level options can be added here as the product expands.'}
        </p>
      </div>
    </div>
  );
}
