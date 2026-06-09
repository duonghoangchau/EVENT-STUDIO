import Link from 'next/link';
import { AdminProjectNav } from '@/components/admin-project-nav';
import { prisma } from '@/lib/db';
import { getServerPreferences } from '@/lib/preferences-server';
import { t } from '@/lib/preferences';
import { notFound } from 'next/navigation';

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id: Number(id) }, include: { forms: true, _count: { select: { submissions: true } } } });

  if (!project) notFound();
  const preferences = await getServerPreferences({ defaultLanguage: project.language === 'en' ? 'en' : 'vi' });

  return (
    <div className="space-y-6">
      <AdminProjectNav current="overview" language={preferences.language} projectId={project.id} projectName={project.name} projectSlug={project.slug} />
      <div className="section-shell p-6">
        <h1 className="text-3xl font-black app-strong">{project.name}</h1>
        <p className="mt-2 app-muted">/{project.slug}</p>
        <p className="mt-4">{project.description}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-5">
        <Link className="btn-primary" href={`/admin/projects/${project.id}/builder`}>
          {t(preferences.language, 'builder')}
        </Link>
        <Link className="btn-secondary" href={`/admin/projects/${project.id}/forms`}>
          {t(preferences.language, 'forms')}
        </Link>
        <Link className="btn-secondary" href={`/${project.slug}`} target="_blank">
          {t(preferences.language, 'publicSite')}
        </Link>
        <Link className="btn-secondary" href={`/admin/preview/${project.slug}`} target="_blank">
          {t(preferences.language, 'preview')}
        </Link>
        <Link className="btn-secondary" href={`/admin/projects/${project.id}/submissions`}>
          {t(preferences.language, 'submissions')} ({project._count.submissions})
        </Link>
      </div>
    </div>
  );
}
