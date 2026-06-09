import Link from 'next/link';
import { AdminProjectNav } from '@/components/admin-project-nav';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id: Number(id) }, include: { forms: true, _count: { select: { submissions: true } } } });

  if (!project) notFound();

  return (
    <div className="space-y-6">
      <AdminProjectNav current="overview" projectId={project.id} projectName={project.name} projectSlug={project.slug} />
      <div className="section-shell p-6">
        <h1 className="text-3xl font-black">{project.name}</h1>
        <p className="mt-2 text-slate-500">/{project.slug}</p>
        <p className="mt-4">{project.description}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-5">
        <Link className="btn-primary" href={`/admin/projects/${project.id}/builder`}>
          Builder
        </Link>
        <Link className="btn-secondary" href={`/admin/projects/${project.id}/forms`}>
          Forms
        </Link>
        <Link className="btn-secondary" href={`/${project.slug}`} target="_blank">
          Public Site
        </Link>
        <Link className="btn-secondary" href={`/admin/preview/${project.slug}`} target="_blank">
          Preview
        </Link>
        <Link className="btn-secondary" href={`/admin/projects/${project.id}/submissions`}>
          Submissions ({project._count.submissions})
        </Link>
      </div>
    </div>
  );
}
