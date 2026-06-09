import Link from 'next/link';
import { AdminBreadcrumbs } from '@/components/admin-breadcrumbs';
import { prisma } from '@/lib/db';
import { getServerPreferences } from '@/lib/preferences-server';
import { t } from '@/lib/preferences';

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' }, include: { forms: true, _count: { select: { submissions: true } } } });
  const preferences = await getServerPreferences();

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: t(preferences.language, 'projects') }]} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black app-strong">{t(preferences.language, 'projects')}</h1>
          <p className="app-muted">{t(preferences.language, 'projectsDescription')}</p>
        </div>
        <Link className="btn-primary" href="/admin/projects/new">
          {t(preferences.language, 'newProject')}
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((project) => (
          <Link href={`/admin/projects/${project.id}`} key={project.id} className="section-shell block p-6 hover:border-blue-300">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-black app-strong">{project.name}</h2>
                <p className="mt-2 text-sm app-muted">/{project.slug}</p>
              </div>
              <span className="rounded-full app-soft px-3 py-1 text-xs font-bold app-muted">{project.status}</span>
            </div>
            <p className="mt-4 line-clamp-2 app-muted">{project.description}</p>
            <div className="mt-5 flex gap-3 text-xs font-bold app-muted">
              <span>{project.forms.length} {t(preferences.language, 'formsLabel')}</span>
              <span>{project._count.submissions} {t(preferences.language, 'submissionsLabel')}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
