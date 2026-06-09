import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function SubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id: Number(id) } });

  if (!project) notFound();

  const rows = await prisma.submission.findMany({ where: { projectId: project.id }, orderBy: { createdAt: 'desc' }, include: { form: true } });

  return (
    <div>
      <h1 className="text-3xl font-black">Submissions</h1>
      <div className="mt-6 section-shell overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="p-4">Time</th>
              <th className="p-4">Form</th>
              <th className="p-4">Data</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className="border-t" key={row.id}>
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
