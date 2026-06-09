import { updateSections } from '@/app/actions';
import { AdminProjectNav } from '@/components/admin-project-nav';
import { PageBuilderEditor } from '@/components/page-builder-editor';
import { prisma } from '@/lib/db';
import { normalizePageJson } from '@/lib/page-schema';
import { getServerPreferences } from '@/lib/preferences-server';
import { t } from '@/lib/preferences';
import { LandingRenderer } from '@/lib/renderer';
import { ThemeConfig } from '@/lib/types';
import { notFound } from 'next/navigation';

export default async function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id: Number(id) }, include: { forms: true } });

  if (!project) notFound();

  const pageJson = normalizePageJson(project.pageJson);
  const theme = project.themeJson as ThemeConfig;
  const formSlug = project.forms[0]?.slug;
  const preferences = await getServerPreferences({ defaultLanguage: project.language === 'en' ? 'en' : 'vi' });

  return (
    <div className="space-y-6">
      <AdminProjectNav current="builder" language={preferences.language} projectId={project.id} projectName={project.name} projectSlug={project.slug} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black app-strong">{t(preferences.language, 'pageBuilder')}</h1>
          <p className="app-muted">{project.name}</p>
        </div>
        <a className="btn-secondary" target="_blank" href={`/admin/preview/${project.slug}`}>
          {t(preferences.language, 'openPreview')}
        </a>
      </div>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_minmax(420px,520px)]">
        <div className="space-y-5 min-w-0">
          <PageBuilderEditor action={updateSections.bind(null, project.id)} initialSections={pageJson.sections} />
        </div>

        <div className="min-w-0 overflow-hidden rounded-3xl border app-border app-surface shadow-sm 2xl:sticky 2xl:top-6 2xl:max-h-[calc(100vh-3rem)]">
          <div className="border-b app-border app-surface-alt px-5 py-3 text-sm font-bold app-strong">{t(preferences.language, 'livePreview')}</div>
          <div className="preview-scroll max-h-[760px] overflow-auto 2xl:max-h-[calc(100vh-6.5rem)]">
            <LandingRenderer sections={pageJson.sections} theme={theme} language={preferences.language} formSlug={formSlug} projectSlug={project.slug} />
          </div>
        </div>
      </div>
    </div>
  );
}
