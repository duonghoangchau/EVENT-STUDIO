import Link from 'next/link';
import { AdminBreadcrumbs } from '@/components/admin-breadcrumbs';
import { prisma } from '@/lib/db';
import { getServerPreferences } from '@/lib/preferences-server';
import { t } from '@/lib/preferences';
import { ArrowRight, Bot, FileText, LayoutTemplate } from 'lucide-react';

export default async function DashboardPage() {
  const [projects, templates, submissions] = await Promise.all([prisma.project.count(), prisma.template.count(), prisma.submission.count()]);
  const preferences = await getServerPreferences();

  return (
    <div className="space-y-8">
      <AdminBreadcrumbs items={[{ label: 'Admin' }, { label: t(preferences.language, 'dashboard') }]} />
      <div className="rounded-3xl bg-slate-950 p-8 text-white">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-3 text-sm font-bold text-blue-300">{t(preferences.language, 'internalTool')}</p>
            <h1 className="text-4xl font-black">Delfi Event Studio</h1>
            <p className="mt-4 max-w-2xl text-slate-300">{t(preferences.language, 'dashboardSummary')}</p>
          </div>
          <Link href="/admin/projects/new" className="btn-primary bg-white text-slate-950 hover:bg-slate-100">
            {t(preferences.language, 'createProject')} <ArrowRight className="ml-2" size={18} />
          </Link>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <Stat icon={<FileText />} label={t(preferences.language, 'projects')} value={projects} />
        <Stat icon={<LayoutTemplate />} label={t(preferences.language, 'templates')} value={templates} />
        <Stat icon={<Bot />} label={t(preferences.language, 'submissions')} value={submissions} />
      </div>
      <div className="section-shell p-6">
        <h2 className="text-xl font-black app-strong">{t(preferences.language, 'mvpFlow')}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-5">
          {(preferences.language === 'vi'
            ? ['Tao project', 'Sua sections', 'Dung form', 'Preview', 'Publish/Export']
            : ['Create Project', 'Edit Sections', 'Build Form', 'Preview', 'Publish/Export']
          ).map((item) => (
            <div key={item} className="rounded-2xl app-surface-alt p-4 text-sm font-bold app-strong">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="section-shell p-6">
      <div className="mb-4 text-blue-600">{icon}</div>
      <div className="text-3xl font-black app-strong">{value}</div>
      <div className="text-sm font-semibold app-muted">{label}</div>
    </div>
  );
}
