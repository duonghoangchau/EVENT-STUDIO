import Link from 'next/link';
import { prisma } from '@/lib/db';

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' }, include: { forms: true, _count: { select: { submissions: true } } } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Projects</h1>
          <p className="text-slate-500">Danh sach event landing page.</p>
        </div>
        <Link className="btn-primary" href="/admin/projects/new">
          Tao moi
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((project) => (
          <Link href={`/admin/projects/${project.id}`} key={project.id} className="section-shell block p-6 hover:border-blue-300">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-black">{project.name}</h2>
                <p className="mt-2 text-sm text-slate-500">/{project.slug}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">{project.status}</span>
            </div>
            <p className="mt-4 line-clamp-2 text-slate-600">{project.description}</p>
            <div className="mt-5 flex gap-3 text-xs font-bold text-slate-500">
              <span>{project.forms.length} form</span>
              <span>{project._count.submissions} submissions</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
