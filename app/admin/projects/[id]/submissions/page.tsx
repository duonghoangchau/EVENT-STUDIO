import { AdminProjectNav } from '@/components/admin-project-nav';
import { prisma } from '@/lib/db';
import { getServerPreferences } from '@/lib/preferences-server';
import { t } from '@/lib/preferences';
import { notFound } from 'next/navigation';

export default async function SubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id: Number(id) } });

  if (!project) notFound();
  const preferences = await getServerPreferences({ defaultLanguage: project.language === 'en' ? 'en' : 'vi' });

  const rows = await prisma.submission.findMany({ where: { projectId: project.id }, orderBy: { createdAt: 'desc' }, include: { form: true } });

  return (
    <div className="space-y-6">
      <AdminProjectNav current="submissions" language={preferences.language} projectId={project.id} projectName={project.name} projectSlug={project.slug} />
      <h1 className="text-3xl font-black app-strong">{t(preferences.language, 'submissions')}</h1>
      <div className="section-shell overflow-hidden">
        <table className="w-full text-sm">
          <thead className="app-surface-alt text-left">
            <tr>
              <th className="p-4">{t(preferences.language, 'time')}</th>
              <th className="p-4">{t(preferences.language, 'form')}</th>
              <th className="p-4">Data</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className="border-t app-border" key={row.id}>
                <td className="p-4">{row.createdAt.toLocaleString()}</td>
                <td className="p-4">{row.form.name}</td>
                <td className="p-4 font-mono text-xs">{JSON.stringify(row.dataJson)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
