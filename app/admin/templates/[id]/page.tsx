import Link from 'next/link';
import { createProjectFromTemplate } from '@/app/actions';
import { AdminBreadcrumbs } from '@/components/admin-breadcrumbs';
import { prisma } from '@/lib/db';
import { normalizePageJson } from '@/lib/page-schema';
import { getServerPreferences } from '@/lib/preferences-server';
import { t } from '@/lib/preferences';
import { LandingRenderer } from '@/lib/renderer';
import { ThemeConfig } from '@/lib/types';
import { notFound } from 'next/navigation';

export default async function TemplatePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const template = await prisma.template.findUnique({ where: { id: Number(id) } });

  if (!template) notFound();

  const pageJson = normalizePageJson(template.templateJson);
  const theme = template.themeJson as ThemeConfig;
  const preferences = await getServerPreferences();

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: t(preferences.language, 'templates'), href: '/admin/templates' }, { label: template.name }]} />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin/templates" className="text-sm font-semibold text-blue-600">
            {preferences.language === 'vi' ? 'Ve danh sach template' : 'Back to templates'}
          </Link>
          <h1 className="mt-2 text-3xl font-black app-strong">{template.name}</h1>
          <p className="mt-2 app-muted">
            {preferences.language === 'vi' ? 'Danh muc:' : 'Category:'} <span className="font-semibold app-strong">{template.category}</span>
          </p>
        </div>

        <form action={createProjectFromTemplate.bind(null, template.id)}>
          <button className="btn-primary" type="submit">
            {preferences.language === 'vi' ? 'Dung template nay' : 'Use template'}
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-3xl border app-border app-surface shadow-sm">
        <div className="border-b app-border app-surface-alt px-5 py-3 text-sm font-bold app-strong">
          {preferences.language === 'vi' ? 'Xem truoc template' : 'Template Preview'}
        </div>
        <div className="max-h-[calc(100vh-12rem)] overflow-auto">
          <LandingRenderer sections={pageJson.sections} theme={theme} language={preferences.language} />
        </div>
      </div>
    </div>
  );
}
