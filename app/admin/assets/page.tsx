import { AdminBreadcrumbs } from '@/components/admin-breadcrumbs';

export default function AssetsPage() {
  return (
    <div className="space-y-6">
      <AdminBreadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Assets' }]} />
      <div className="section-shell p-8">
        <h1 className="text-3xl font-black">Asset Library</h1>
        <p className="mt-3 text-slate-500">
          MVP hien luu upload tai <code>/public/uploads</code>. Giai doan sau them upload UI, Supabase Storage/S3 va asset mapping tap trung.
        </p>
      </div>
    </div>
  );
}
