import Link from 'next/link';
import { createProjectFromTemplate } from '@/app/actions';
import { AdminBreadcrumbs } from '@/components/admin-breadcrumbs';
import { prisma } from '@/lib/db';
import { normalizePageJson } from '@/lib/page-schema';
import { ThemeConfig } from '@/lib/types';

export default async function TemplatesPage() {
  const templates = await prisma.template.findMany({ orderBy: { id: 'asc' } });

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Templates' }]} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Template Gallery</h1>
          <p className="text-slate-500">Chon mot mau co san, xem preview, roi tao project moi tu template do.</p>
        </div>
        <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">{templates.length} templates</div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
        {templates.map((template) => {
          const pageJson = normalizePageJson(template.templateJson);
          const theme = template.themeJson as ThemeConfig;
          const hero = pageJson.sections.find((section) => section.type === 'hero');
          const about = pageJson.sections.find((section) => section.type === 'about');
          const heroTitle = String(hero?.data?.title || template.name);
          const heroSubtitle = String(hero?.data?.subtitle || about?.data?.body || '');

          return (
            <div key={template.id} className="section-shell overflow-hidden p-0">
              <div className="p-6 text-white" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}>
                <div className="flex h-44 flex-col justify-between rounded-2xl border border-white/20 bg-white/8 p-5 backdrop-blur">
                  <div className="inline-flex w-fit rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white/90">
                    {template.category}
                  </div>
                  <div>
                    <div className="line-clamp-2 text-2xl font-black">{heroTitle}</div>
                    <p className="mt-2 line-clamp-3 max-w-sm text-sm text-white/80">{heroSubtitle}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-6">
                <div>
                  <h2 className="font-black">{template.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {pageJson.sections.length} sections, built for {template.category} events
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link href={`/admin/templates/${template.id}`} className="btn-secondary">
                    Preview
                  </Link>
                  <form action={createProjectFromTemplate.bind(null, template.id)}>
                    <button className="btn-primary" type="submit">
                      Use template
                    </button>
                  </form>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
