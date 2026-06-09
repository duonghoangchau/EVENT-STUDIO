import { AdminBreadcrumbs } from '@/components/admin-breadcrumbs';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <AdminBreadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Settings' }]} />
      <div className="section-shell p-8">
        <h1 className="text-3xl font-black">Settings</h1>
        <p className="mt-3 text-slate-500">Cau hinh MySQL, storage, publish domain va cac tham so he thong o cac version sau.</p>
      </div>
    </div>
  );
}
