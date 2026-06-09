import { updateSections } from '@/app/actions';
import { AdminProjectNav } from '@/components/admin-project-nav';
import { PageBuilderEditor } from '@/components/page-builder-editor';
import { prisma } from '@/lib/db';
import { normalizePageJson } from '@/lib/page-schema';
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

  return (
    <div className="space-y-6">
      <AdminProjectNav current="builder" projectId={project.id} projectName={project.name} projectSlug={project.slug} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Page Builder</h1>
          <p className="text-slate-500">{project.name}</p>
        </div>
        <a className="btn-secondary" target="_blank" href={`/admin/preview/${project.slug}`}>
          Open Preview
        </a>
      </div>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_minmax(420px,520px)]">
        <div className="space-y-5 min-w-0">
          <PageBuilderEditor action={updateSections.bind(null, project.id)} initialSections={pageJson.sections} />
        </div>

        <div className="min-w-0 overflow-hidden rounded-3xl border bg-white shadow-sm 2xl:sticky 2xl:top-6 2xl:max-h-[calc(100vh-3rem)]">
          <div className="border-b bg-slate-50 px-5 py-3 text-sm font-bold">Live Preview</div>
          <div className="max-h-[760px] overflow-auto 2xl:max-h-[calc(100vh-6.5rem)]">
            <LandingRenderer sections={pageJson.sections} theme={theme} formSlug={formSlug} projectSlug={project.slug} />
          </div>
        </div>
      </div>
    </div>
  );
}
